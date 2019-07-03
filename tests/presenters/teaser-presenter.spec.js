const expect = require('chai').expect;
const sinon = require('sinon');
const Presenter = require('../../src/presenters/teaser-presenter');
const articleBrandFixture = require('../fixtures/article-brand-fixture');
const articleOpinionAuthorFixture = require('../fixtures/article-opinion-author-fixture');
const articleStandardFixture = require('../fixtures/article-standard-fixture');
const articlePackageFixture = require('../fixtures/article-package-fixture');
const videoFromNextApiFixture = require('../fixtures/video-fixture');
const videoFromNextElasticFixture = require('../fixtures/video-es-fixture');

describe('Teaser Presenter', () => {

	let subject;

	describe('classModifiers', () => {

		it('produces an empty array if mods undefined', () => {
			const content = { mods: undefined };
			subject = new Presenter(content);
			expect(subject.classModifiers).to.deep.equal([]);
		});

		it('does not mutate original mods object', () => {
			const mods = ['test'];
			const content = { mods, isOpinion:true };
			const subject = new Presenter(content);
			expect(subject.classModifiers).to.contain('opinion');
			expect(mods).to.not.contain('opinion');
		});

		it('passes through modifiers from collection', () => {
			const content = {mods: ['mod1', 'mod2']};
			subject = new Presenter(content);
			expect(subject.classModifiers).to.deep.equal(content.mods);
		});

		it('returns an empty array if there is no relevant data', () => {
			const content = {};
			subject = new Presenter(content);
			expect(subject.classModifiers.length).to.equal(0);
		});

		it('adds a modifier equal to the size property if it exists', () => {
			const content = {size: 'this-is-a-size'};
			subject = new Presenter(content);
			expect(subject.classModifiers[0]).to.deep.equal(content.size);
		});

		it('adds a syndication modifier if the given article is available for syndication', () => {
			const content = {canBeSyndicated:'yes'};
			subject = new Presenter(content);
			expect(subject.classModifiers[0]).to.deep.equal('syndicatable');
		});

		it('adds a syndication modifier if the given article is NOT available for syndication', () => {
			const content = {canBeSyndicated:'no'};
			subject = new Presenter(content);
			expect(subject.classModifiers[0]).to.deep.equal('not-syndicatable');
		});

		context('has theme', () => {
			it('returns extra-article when package theme is extra', () => {
				subject = new Presenter(articlePackageFixture);
				expect(subject.classModifiers).to.include('extra-article');
			});

			it('returns highlight when package theme is special-report', () => {
				const content = Object.assign({}, articlePackageFixture, { containedIn: [ { design: { theme: 'special-report'} } ] });
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('highlight');
			});
		});

		it('adds a syndication modifier if the given article’s syndication status needs verifying', () => {
			const content = {canBeSyndicated:'verify'};
			subject = new Presenter(content);
			expect(subject.classModifiers[0]).to.deep.equal('verify-syndicatable');
		});

		context('has-headshot', () => {

			it('returns has-headshot when correct template and has-headshot', () => {
				const content = Object.assign({}, articleOpinionAuthorFixture, {template: 'standard'});
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('has-headshot');
			});

			it('does not add a modifier if wrong template but has headshot', () => {
				const content = Object.assign({}, articleOpinionAuthorFixture, {template: 'no-headshot'});
				subject = new Presenter(content);
				expect(subject.classModifiers).to.not.include('has-headshot');
			});

			it('does not add a modifier if correct template but does not have a headshot', () => {
				const content = {template: 'light'};
				subject = new Presenter(content);
				expect(subject.classModifiers.length).to.equal(0);
			});

			it('does not add a modifier if noHeadshot parameter passed through', () => {
				const content = Object.assign({noHeadshot: true}, articleOpinionAuthorFixture, {template: 'standard'});
				subject = new Presenter(content);
				expect(subject.classModifiers).to.not.include('has-headshot');
			});

		});

		context('has-image', () => {
			it('returns has-image when correct template and there is a mainImage', () => {
				const content = {mainImage: true, template: 'heavy'};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['has-image']);
			});

			it('returns has-image when correct template and there is a promotional image', () => {
				const content = {promotionalImage: true, template: 'heavy'};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['has-image']);
			});

			it('does not add a modifier if wrong template but has mainImage', () => {
				const content = {mainImage: true, template: 'standard'};
				subject = new Presenter(content);
				expect(subject.classModifiers.length).to.equal(0);
			});

			it('does not add a modifier if correct template but does not have a mainImage', () => {
				const content = {template: 'heavy'};
				subject = new Presenter(content);
				expect(subject.classModifiers.length).to.equal(0);
			});
		});

		context('opinion', () => {
			it('returns opinion when content has isOpinion set to true', () => {
				const content = {isOpinion: true, mods: []};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['opinion']);
			});

			it('does not return opinion if isOpinion is false', () => {
				const content = {isOpinion: false};
				subject = new Presenter(content);
				expect(subject.classModifiers.length).to.equal(0);
			});

			it('does not return opinion if it is a hero-image layout', () => {
				const content = {isOpinion: true, mods: ['hero-image']};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['hero-image']);
			});
		});

		context('video', () => {
			it('returns true for isVideo when the type is a video', () => {
				const content = {type: 'Video'};
				subject = new Presenter(content);
				expect(subject.isVideo).to.equal(true);
			});

			it('does not return true for isVideo when the type is not a video', () => {
				const content = {type: 'Package'};
				subject = new Presenter(content);
				expect(subject.isVideo).to.equal(false);
			});
		});

		context('highlight', () => {
			it('returns highlight when content has isEditorsChoice set to true', () => {
				const content = {isEditorsChoice: true, mods: []};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['highlight']);
			});

			it('does not return opinion if isEditorsChoice is false', () => {
				const content = {isEditorsChoice: false};
				subject = new Presenter(content);
				expect(subject.classModifiers.length).to.equal(0);
			});

			it('does not return highlight if it is a hero-image layout', () => {
				const content = {isEditorsChoice: true, mods: ['hero-image']};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['hero-image']);
			});
		});

		context('type', () => {
			it('returns `article` when content has `type` set to `Article`', () => {
				const content = {type: 'Article'};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['article']);
			});

			it('returns `video` when content has `type` set to `video`', () => {
				const content = {type: 'video'};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['video']);
			});

			it('returns `live-blog` when content has `type` set to `LiveBlog`', () => {
				const content = {type: 'LiveBlog'};
				subject = new Presenter(content);
				expect(subject.classModifiers).to.deep.equal(['live-blog']);
			});
		});

	});

	describe('teaserConcept', () => {

		context('special report serverd from DFP', () => {
			// The response object already contains a teaserConcept property
			// which is set in n-native-ads. We just need to return this.
			it('returns the original teaserConcept in the response', () => {
				const data = {
					type: 'special-report',
					teaserConcept: {
						prefLabel: 'tease me',
						relativeUrl: 'http://www.teaseme.com'
					}
				};
				subject = new Presenter(data);
				expect(subject.teaserConcept).to.deep.equal(data.teaserConcept);
			});
		});
		context('not on a stream page', () => {

			const brand = { brandConcept: { isBrand: true } };
			const displayConcept = { displayConcept: { isDisplay: true } };

			it('returns the brand when it exists', () => {
				const content = Object.assign({}, brand, displayConcept);
				subject = new Presenter(content);
				expect(subject.teaserConcept.isBrand).to.be.true;
			});

			it('returns the displayConcept when it exists and when brand does not', () => {
				const content = Object.assign({}, displayConcept);
				subject = new Presenter(content);
				expect(subject.teaserConcept.isDisplay).to.be.true;
			});

			it('returns null if neither the brand nor displayConcept exist', () => {
				const content = {};
				subject = new Presenter(content);
				expect(subject.teaserConcept).to.be.null;
			});

		});

		context('package article', () => {
			it('renders as display concept for package article', () => {
				subject = new Presenter(articlePackageFixture);
				expect(subject.teaserConcept.prefLabel).to.equal('Management’s missing women');
			});
		});

		context('genrePrefix', () => {

			const genre = {
				genre: {
					id: '61d707b5-6fab-3541-b017-49b72de80772',
					prefLabel: 'genre label'
				}
			};
			const brand = { brandConcept: { id: 'ABC' } };
			const streamProperties = { streamProperties: { id: 'ABC'}};
			const streamPropertiesSpecial = { streamProperties: { directType: 'http://www.ft.com/ontology/SpecialReport'}};
			const genreSpecial = { genre: { prefLabel: 'Special Report' } };

			it('returns null if there is no genre', () => {
				const content = {};
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns null if there is a genre concept but the display concept is the brand concept', () => {
				const content = Object.assign({}, genre, brand);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns the label of the genre concept if it exists and there is no brand concept', () => {
				const content = Object.assign({}, genre);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(genre.genre.prefLabel);
			});

			it('returns the label of the genre concept if it exists and the brand concept is not displayed', () => {
				const content = Object.assign({}, genre, brand, streamProperties);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(genre.genre.prefLabel);
			});

			it('returns null when on a special reports stream page', () => {
				const content = Object.assign({}, genreSpecial, streamPropertiesSpecial);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns the package brand if article in package', () => {
				subject = new Presenter(articlePackageFixture);
				expect(subject.genrePrefix).to.equal('FT Series');
			});

			it('returns "Special Report" if the type is special-report', () => {
				subject = new Presenter({ type: 'special-report'});
				expect(subject.genrePrefix).to.equal('Special Report');
			});

		});

		context('on a stream page', () => {

			const brand = { brandConcept: { isBrand: true, id: 'ABC' } };
			const displayConcept = { displayConcept: { isDisplay: true } };
			const streamProperties = { streamProperties: { id: 'XYZ'} };
			const streamPropertiesMatch = { streamProperties: { id: 'ABC'} };

			it('returns the brand if not the same as the streamId', () => {
				const content = Object.assign({}, streamProperties, brand, displayConcept);
				subject = new Presenter(content);
				expect(subject.teaserConcept.isBrand).to.be.true;
			});

			it('returns the displayConcept if brand is same as streamId', () => {
				const content = Object.assign({}, streamPropertiesMatch, brand, displayConcept);
				subject = new Presenter(content);
				expect(subject.teaserConcept.isDisplay).to.be.true;
			});

			it('returns the displayConcept if no brand', () => {
				const content = Object.assign({}, streamPropertiesMatch, displayConcept);
				subject = new Presenter(content);
				expect(subject.teaserConcept.isDisplay).to.be.true;
			});

		});

		context('when it is both a brand and an opinion / author', () => {

			const brand = { brandConcept: { prefLabel: 'brandName', directType: 'http://www.ft.com/ontology/Brand' } };
			const brandDupe = { brandConcept: { prefLabel: 'authorName', directType: 'http://www.ft.com/ontology/Brand' } };
			const authors = { authors: [ { prefLabel: 'authorName', directType: 'http://www.ft.com/ontology/Person', id: 'XYZ' } ] };
			const isOpinion = { isOpinion: true };

			it('returns the brand as genrePrefix and author as displayConcept', () => {
				const content = Object.assign({}, brand, authors, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(brand.brandConcept.prefLabel);
				expect(subject.teaserConcept).to.deep.equal(authors.authors[0]);
			});

			it('returns only the author as displayConcept if brand and author are the same', () => {
				const content = Object.assign({}, brandDupe, authors, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
				expect(subject.teaserConcept).to.deep.equal(authors.authors[0]);
			});

			it('returns brand as display concept and no genre prefix if the author is the same as the stream', () => {
				const content = Object.assign({ streamProperties: { id: 'XYZ' } }, brand, authors, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
				expect(subject.teaserConcept).to.deep.equal(brand.brandConcept);
			});

		});

	});

	describe('advertiserPrefix', () => {

		it('paid for by - when has an advertiser and type of promoted content', () => {
			const content = {
				advertiser: 'Nikkei',
				type: 'promoted-content'
			};
			subject = new Presenter(content);
			expect(subject.advertiserPrefix).to.equal(' paid for by ');
		});

		it('by - when has an advertiser and type of paid post', () => {
			const content = {
				advertiser: 'Nikkei',
				type: 'paid-post'
			};
			subject = new Presenter(content);
			expect(subject.advertiserPrefix).to.equal(' by ');
		});

		it('blank - when does not have an advertiser and type is article', () => {
			const content = {
				type: 'article'
			};
			subject = new Presenter(content);
			expect(subject.advertiserPrefix).to.equal('');
		});

	});

	describe('timeStatus', () => {

		const FIFTY_NINE_MINUTES = 1000 * 60 * 59;
		const SIXTY_ONE_MINUTES = 1000 * 60 * 61;

		context('less than an hour since the article published', () => {

			it('returns new when publishedDate and firstPublishedDate are the same', () => {
				const fiftyNineMinutesAgo = Date.now() - FIFTY_NINE_MINUTES;
				const content = {
					publishedDate: fiftyNineMinutesAgo,
					firstPublishedDate: fiftyNineMinutesAgo
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.equal('new');
			});

			it('returns updated when published date and firstPublishedDate differ', () => {
				const content = {
					publishedDate: Date.now() - FIFTY_NINE_MINUTES,
					firstPublishedDate: Date.now() - SIXTY_ONE_MINUTES
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.equal('updated');
			});

			it('is newer than 4 hours', () => {
				const content = {
					publishedDate: Date.now() - FIFTY_NINE_MINUTES
				};
				subject = new Presenter(content);
				expect(subject.isNewerThanFourHours()).to.be.true;
			});

		});

		context('more than an hour since the article published', () => {

			it('returns null', () => {
				const sixtyOneMinutesAgo = Date.now() - SIXTY_ONE_MINUTES;
				const content = {
					publishedDate: sixtyOneMinutesAgo,
					firstPublishedDate: sixtyOneMinutesAgo
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.be.null;
			});
		});

		context('more than 4 hours since the article published', () => {

			const FOUR_HOURS = 1000 * 60 * 60 * 4;

			it('is not newer than 4 hours', () => {
				const fourHoursAgo = Date.now() - FOUR_HOURS;
				const content = {
					publishedDate: fourHoursAgo
				};
				subject = new Presenter(content);
				expect(subject.isNewerThanFourHours()).to.be.false;
			});
		});

	});

	describe('liveBlog', () => {

		context('status mapping', () => {

			it('returns status \'live\' when \'inprogress\'', () => {
				const content = { status: 'InProgress' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('live');
				expect(subject.liveBlog().classModifier).to.equal('inprogress');
			});

			it('returns status \'coming soon\' when \'comingsoon\'', () => {
				const content = { status: 'ComingSoon' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('coming soon');
				expect(subject.liveBlog().classModifier).to.equal('comingsoon');
			});

			it('returns no status when \'closed\'', () => {
				const content = { status: 'Closed' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('');
				expect(subject.liveBlog().classModifier).to.equal('closed');
			});

			it('adds the class live when inprocess', () => {
				const content = { status: 'inprogress', type: 'LiveBlog' };
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('live');
			});

			it('does not add the class live if it is not inprogress', () => {
				const content = { status: 'closed', type: 'LiveBlog' };
				subject = new Presenter(content);
				expect(subject.classModifiers).to.not.include('live');
			});

		});

		context('label modifier', () => {

			it('returns modifier of \'pending\' when \'comingsoon\'', () => {
				const content = { status: 'ComingSoon' };
				subject = new Presenter(content);
				expect(subject.liveBlogLabelModifier).to.equal('pending');
			});

			it('returns modifier of \'live\' when \'inprogress\'', () => {
				const content = { status: 'InProgress' };
				subject = new Presenter(content);
				expect(subject.liveBlogLabelModifier).to.equal('live');
			});

			it('returns modifier of \'closed\' when \'closed\'', () => {
				const content = { status: 'Closed' };
				subject = new Presenter(content);
				expect(subject.liveBlogLabelModifier).to.equal('closed');
			});

		});

	});

	describe('live package', () => {
		it('adds the class live to the first article in a live package', () => {
			const content = {
				id: '123',
				containedIn: [
					{
						contains: [
							{ id: '123' },
							{ id: '456', status: 'inprogress' },
							{ id: '789' }
						]
					}
				]
			};

			subject = new Presenter(content);
			expect(subject.classModifiers).to.include('live');
		});

		it('does not add the class live to other articles in the package', () => {
			const content = {
				id: '789',
				containedIn: [
					{
						contains: [
							{ id: '123' },
							{ id: '456', status: 'inprogress' },
							{ id: '789' }
						]
					}
				]
			};

			subject = new Presenter(content);
			expect(subject.classModifiers).not.to.include('live');
		});

		it('does not add the class live if the liveblog is closed', () => {
			const content = {
				id: '123',
				containedIn: [
					{
						contains: [
							{ id: '123' },
							{ id: '456', status: 'closed' },
							{ id: '789' }
						]
					}
				]
			};

			subject = new Presenter(content);
			expect(subject.classModifiers).not.to.include('live');
		});
	});

	describe('relatedContent', () => {

		it('returns the curated related content when they exists', () => {
			subject = new Presenter(articleStandardFixture);
			expect(subject.relatedContent.map(item => item.data)).to.deep.equal(articleStandardFixture.curatedRelatedContent);
		});

		it('returns latest content of display concept when no curated related content, current article filtered', () => {
			subject = new Presenter(articleBrandFixture);
			expect(subject.relatedContent.length).to.equal(3);
			subject.relatedContent.map(content => {
				expect(content.data.id).to.not.equal(articleBrandFixture.id);
			});
		});

	});

	describe('headshot', () => {

		it('returns the full headshot file url and author name when a headshot exists', () => {
			subject = new Presenter(articleOpinionAuthorFixture);
			expect(subject.headshot.url).to.equal('https://www.ft.com/__origami/service/image/v2/images/raw/fthead:gideon-rachman?source=next&width=150&fit=scale-down&compression=best&tint=054593,d6d5d3');
		});

		it('returns null when headshot does not exist', () => {
			subject = new Presenter(articleBrandFixture);
			expect(subject.headshot).to.be.null;
		});

		it('returns the headshot file url with the requested tint when a custom `headshotTint` is specified', () => {
			const articleOpinionAuthorFixtureCustomTint = Object.assign({}, articleOpinionAuthorFixture, {
				headshotTint: '00FF00,FF0000'
			});
			subject = new Presenter(articleOpinionAuthorFixtureCustomTint);
			expect(subject.headshot.url).to.equal('https://www.ft.com/__origami/service/image/v2/images/raw/fthead:gideon-rachman?source=next&width=150&fit=scale-down&compression=best&tint=00FF00,FF0000');
		});

		context('author brand combo', () => {

			const brand = {
				brand: {
					prefLabel: 'brandName',
					directType: 'http://www.ft.com/ontology/Brand'
				}
			};
			const authors = {
				authors: [{
					prefLabel: 'authorName',
					headshot: {
						name: 'author-name'
					}
				}]
			};
			const isOpinion = {
				isOpinion: true
			};

			it('returns a headshot when the author has one', () => {
				const content = Object.assign({}, brand, authors, isOpinion);
				subject = new Presenter(content);
				expect(subject.headshot.url).to.include('author-name');
			});

		});

	});

	describe('displayTitle', () => {
		const title = { title: 'title'};
		const promotionalTitle = { promotionalTitle: 'promotional' };
		const alternativeTitles = { alternativeTitles: { contentPackageTitle: 'contentTitle', promotionalTitleVariant: 'variantHeadline' }};
		const allTitles = Object.assign({}, title, promotionalTitle, alternativeTitles);

		it('Returns the title if teaserTest inactive and teaserPromo inactive', () => {
			const content = Object.assign({}, allTitles);
			subject = new Presenter(content);
			sinon.stub(subject, 'isTeaserTestActive').get(() => false);
			sinon.stub(subject, 'isTeaserPromoActive').get(() => false);
			expect(subject.displayTitle).to.equal('title');
		});

		it('Returns the relevant teaser promoTitle if teaserPromo active', () => {
			subject = new Presenter( {} );
			sinon.stub(subject, 'isTeaserTestActive').get(() => false);
			sinon.stub(subject, 'isTeaserPromoActive').get(() => true);
			sinon.stub(subject, 'teaserPromoTitleText').get(() => 'a promo title');
			expect(subject.displayTitle).to.equal('a promo title');
		});

	});

	describe('get isTeaserPromoActive', () => {
		const flagOn = { teaserUsePromotionalTitle: true };

		it('returns true if promo title configured', () => {
			const flags = Object.assign({}, flagOn);
			subject = new Presenter( Object.assign({}, {flags} ) );
			sinon.stub(subject, 'teaserPromoTitleText').get(() => 'somePromoText');
			expect(subject.isTeaserPromoActive).to.equal(true);
		});
		it('returns false if no promo title configured', () => {
			const flags = Object.assign({}, flagOn);
			subject = new Presenter(Object.assign({}, {flags} ));
			sinon.stub(subject, 'teaserPromoTitleText').get(() => null);
			expect(subject.isTeaserPromoActive).to.equal(false);
		});

	});

	describe('get teaserPromoTitleText', () => {
		const title = { title: 'title'};
		const promotionalTitle = { promotionalTitle: 'promotional' };
		const alternativeTitles = { alternativeTitles: { contentPackageTitle: 'contentTitle', promotionalTitleVariant: 'variantHeadline', promotionalTitle: 'altPromotional' } };
		const allTitles = Object.assign({}, title, promotionalTitle, alternativeTitles);

		it('uses promotionalTitle if present', () => {
			const content = Object.assign({}, allTitles );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserPromoTitleText).to.equal('promotional');
		});

		it('uses alternativeTitles.promotionalTitle if promotionalTitle not present', () => {
			const content = Object.assign({}, alternativeTitles, title );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserPromoTitleText).to.equal('altPromotional');
		});

		it('returns null if neither promoTitle found', () => {
			const content = Object.assign({}, { title: 'the-title', alternativeTitles: { promotionalTitleVariant: 'variantHeadline' } } );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserPromoTitleText).to.equal(null);
		});
	});

	describe('get teaserTestVariant', () => {
		it('inspects the right flag to see what variant specified for this particular teaser', () => {
			const flags = {'teaser-test-content-uuid-1': 'variant1', 'teaser-test-content-uuid-2': 'variant2'};
			const subject1 = new Presenter(Object.assign({}, {id: 'content-uuid-1'}, {flags} ));
			const subject2 = new Presenter(Object.assign({}, {id: 'content-uuid-2'}, {flags} ));
			const subject3 = new Presenter(Object.assign({}, {id: 'content-uuid-3'}, {flags} ));  // no flag at all for this teaser
			expect(subject1.teaserTestVariant).to.equal('variant1');
			expect(subject2.teaserTestVariant).to.equal('variant2');
			expect(subject3.teaserTestVariant).to.equal(null);
		});
	});

	describe('isTeaserTestActive', () => {
		it('returns true if flag is set for that teaser AND variant headlines are configured for that teaser', () => {
			const flags = {'teaser-test-content-uuid-1': 'some-variant'};
			const content = Object.assign({}, { id: 'content-uuid-1'}, { alternativeTitles: { promotionalTitleVariant: 'the-promotional-title-variant' }} );
			subject = new Presenter(Object.assign( {}, content, {flags} ));
			expect(subject.isTeaserTestActive).to.equal(true);
		});
		it('returns false if flag not set for that teaser', () => {
			const content = Object.assign({}, { id: 'content-uuid-1'}, { alternativeTitles: { promotionalTitleVariant: 'the-promotional-title-variant' }} );
			subject = new Presenter(Object.assign( {}, content ));
			expect(subject.isTeaserTestActive).to.equal(false);
		});
		it('returns false if no alt titles configured for that teaser', () => {
			const content = Object.assign({}, { id: 'content-uuid-1'}, { title: 'the-title' } );
			subject = new Presenter(Object.assign( {}, content ));
			expect(subject.isTeaserTestActive).to.equal(false);
		});
	});

	describe('get teaserTestVariantText', () => {
		it('uses promotionalTitleVariant if present', () => {
			const content = Object.assign({}, { alternativeTitles: { promotionalTitleVariant: 'the-promotional-title-variant', contentPackageTitle: 'the-content-package-title'}, title: 'the-title' } );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserTestVariantText).to.equal('the-promotional-title-variant');
		});

		it('uses contentPackageTitle if promotionalTitleVariant not present', () => {
			const content = Object.assign({}, { alternativeTitles: { promotionalTitleVariant: null, contentPackageTitle: 'the-content-package-title'}, title: 'the-title' } );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserTestVariantText).to.equal('the-content-package-title');
		});

		it('returns null if neither alternativeTitle found', () => {
			const content = Object.assign({}, { title: 'the-title' } );
			subject = new Presenter(Object.assign({}, content ));
			expect(subject.teaserTestVariantText).to.equal(null);
		});
	});

	describe('display standfirst', () => {
		const standfirst = { standfirst: 'This is the standfirst' };
		const promotionalStandfirst = { promotionalStandfirst: 'This is promotional' };
		it('uses the standfirst if no promotional', () => {
			const content = Object.assign({}, standfirst);
			subject = new Presenter(content);
			expect(subject.displayStandfirst).to.equal('This is the standfirst');
		});

		it('uses the promotional if no standfirst', () => {
			const content = Object.assign({}, promotionalStandfirst);
			subject = new Presenter(content);
			expect(subject.displayStandfirst).to.equal('This is promotional');
		});

		it('prefers the regular standfirst (because promotionalStandfirst is used for web app skylines)', () => {
			const content = Object.assign({}, standfirst, promotionalStandfirst);
			subject = new Presenter(content);
			expect(subject.displayStandfirst).to.equal('This is the standfirst');
		});
	});

	describe('display image', () => {
		const mainImage = { mainImage: { url: 'main-image' }};
		const promotionalImage = { promotionalImage: { url: 'promotional-image' }};

		it('uses the mainImage if no promotional', () => {
			const content = Object.assign({}, mainImage);
			subject = new Presenter(content);
			expect(subject.displayImage.url).to.equal('main-image');
		});

		it('uses the promotional if no main image', () => {
			const content = Object.assign({}, promotionalImage);
			subject = new Presenter(content);
			expect(subject.displayImage.url).to.equal('promotional-image');
		});

		it('prefers the promotional image to the main image', () => {
			const content = Object.assign({}, mainImage, promotionalImage);
			subject = new Presenter(content);
			expect(subject.displayImage.url).to.equal('promotional-image');
		});
	});

	describe('duration', () => {
		it('returns null when data is not available', () => {
			subject = new Presenter({});
			expect(subject.duration).to.be.null;
		});
		context('with video data from next-api', () => {
			it('returns an object when data is available', () => {
				subject = new Presenter(videoFromNextApiFixture);
				expect(subject.duration).to.be.an('object');
			});

			it('returns the duration in ISO8601 format', () => {
				subject = new Presenter(videoFromNextApiFixture);
				expect(subject.duration.iso).to.equal('PT4M30S');
			});

			it('returns the duration in mm:ss format', () => {
				subject = new Presenter(videoFromNextApiFixture);
				expect(subject.duration.formatted).to.equal('4:30');
			});

			it('returns the duration in original MS format', () => {
				subject = new Presenter(videoFromNextApiFixture);
				expect(subject.duration.ms).to.equal(270655);
			});
		});

		context('with video data from next-es-interface', () => {
			it('returns an object when data is available', () => {
				subject = new Presenter(videoFromNextElasticFixture);
				expect(subject.duration).to.be.an('object');
			});

			it('returns the duration in ISO8601 format', () => {
				subject = new Presenter(videoFromNextElasticFixture);
				expect(subject.duration.iso).to.equal('PT4M30S');
			});

			it('returns the duration in mm:ss format', () => {
				subject = new Presenter(videoFromNextElasticFixture);
				expect(subject.duration.formatted).to.equal('4:30');
			});

			it('returns the duration in original MS format', () => {
				subject = new Presenter(videoFromNextElasticFixture);
				expect(subject.duration.ms).to.equal(270655);
			});
		});

	});
});
