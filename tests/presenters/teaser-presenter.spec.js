const expect = require('chai').expect;
const Presenter = require('../../src/presenters/teaser-presenter');
const articleBrandFixture = require('../fixtures/article-brand-fixture');
const articleOpinionAuthorFixture = require('../fixtures/article-opinion-author-fixture');
const articleStandardFixture = require('../fixtures/article-standard-fixture');
const articlePackageFixture = require('../fixtures/article-package-fixture');
const videoFixture = require('../fixtures/video-fixture');

describe('Teaser Presenter', () => {

	let subject;

	context('classModifiers', () => {

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
		})

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
			})

			it('returns highlight when package theme is special-report', () => {
				const content = Object.assign({}, articlePackageFixture, { containedIn: [ { design: { theme: 'special-report'} } ] })
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('highlight');
			})
		})

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

			it('returns `video` when content has `type` set to `Video`', () => {
				const content = {type: 'Video'};
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

	context('displayTag', () => {

		context('not on a stream page', () => {

			const primaryBrandTag = { primaryBrandTag: { primaryBrandTag: true } };
			const teaserTag = { teaserTag: { teaserTag: true } };

			it('returns the primaryBrandTag when it exists', () => {
				const content = Object.assign({}, primaryBrandTag, teaserTag);
				subject = new Presenter(content);
				expect(subject.displayTag.primaryBrandTag).to.be.true;
			});

			it('returns the teaserTag when it exists and when primaryBrandTag does not', () => {
				const content = Object.assign({}, teaserTag);
				subject = new Presenter(content);
				expect(subject.displayTag.teaserTag).to.be.true;
			});

			it('returns null if neither the primaryBrandTag nor teaserTag exist', () => {
				const content = {};
				subject = new Presenter(content);
				expect(subject.displayTag).to.be.null;
			});

		});

		context('package article', () => {
			it('renders as display tag for package article', () => {
				subject = new Presenter(articlePackageFixture);
				expect(subject.displayTag.prefLabel).to.equal('Management’s missing women')
			});
		});

		context('genrePrefix', () => {

			const genreTag = { genreTag: { prefLabel: 'genre label' } };
			const primaryBrandTag = { primaryBrandTag: { idV1: 'ABC' } };
			const streamProperties = { streamProperties: { idV1: 'ABC'}};
			const streamPropertiesSpecial = { streamProperties: { taxonomy: 'specialReports'}};
			const genreTagSpecial = { genreTag: { prefLabel: 'Special Report' } };

			it('returns null if there is no genreTag', () => {
				const content = {};
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns null if there is a genre tag but the display tag is the primary brand tag', () => {
				const content = Object.assign({}, genreTag, primaryBrandTag);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns the label of the genre tag if it exists and there is no primary brand tag', () => {
				const content = Object.assign({}, genreTag);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(genreTag.genreTag.prefLabel);
			});

			it('returns the label of the genre tag if it exists and the primary brand tag is not displayed', () => {
				const content = Object.assign({}, genreTag, primaryBrandTag, streamProperties);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(genreTag.genreTag.prefLabel);
			});

			it('returns null when on a special reports stream page', () => {
				const content = Object.assign({}, genreTagSpecial, streamPropertiesSpecial);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
			});

			it('returns the package brand if article in package', () => {
				subject = new Presenter(articlePackageFixture);
				expect(subject.genrePrefix).to.equal('FT Series')
			})

		});

		context('on a stream page', () => {

			const primaryBrandTag = { primaryBrandTag: { primaryBrandTag: true, idV1: 'ABC' } };
			const primaryTag = { primaryTag: { primaryTag: true } };
			const teaserTag = { teaserTag: { teaserTag: true } };
			const streamProperties = { streamProperties: { idV1: 'XYZ'} };
			const streamPropertiesMatch = { streamProperties: { idV1: 'ABC'} };

			it('returns the primaryBrandTag if not the same as the streamId', () => {
				const content = Object.assign({}, streamProperties, primaryBrandTag, primaryTag, teaserTag);
				subject = new Presenter(content);
				expect(subject.displayTag.primaryBrandTag).to.be.true;
			});

			it('returns the primaryTag if primaryBrandTag is same as streamId', () => {
				const content = Object.assign({}, streamPropertiesMatch, primaryBrandTag, primaryTag, teaserTag);
				subject = new Presenter(content);
				expect(subject.displayTag.primaryTag).to.be.true;
			});

			it('returns the teaserTag if no primaryBrandTag', () => {
				const content = Object.assign({}, streamPropertiesMatch, primaryTag, teaserTag);
				subject = new Presenter(content);
				expect(subject.displayTag.teaserTag).to.be.true;
			});

		});

		context('when it is both a brand and an opinion / author', () => {

			const primaryBrandTag = { primaryBrandTag: { prefLabel: 'brandName', taxonomy: 'brand' } };
			const primaryBrandTagDupe = { primaryBrandTag: { prefLabel: 'authorName', taxonomy: 'brand' } };
			const authorTags = { authorTags: [ { prefLabel: 'authorName', taxonomy: 'author', idV1: 'XYZ' } ] };
			const isOpinion = { isOpinion: true }

			it('returns the brand as genrePrefix and author as displayTag', () => {
				const content = Object.assign({}, primaryBrandTag, authorTags, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.equal(primaryBrandTag.primaryBrandTag.prefLabel);
				expect(subject.displayTag).to.deep.equal(authorTags.authorTags[0]);
			});

			it('returns only the author as displayTag if brand and author are the same', () => {
				const content = Object.assign({}, primaryBrandTagDupe, authorTags, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
				expect(subject.displayTag).to.deep.equal(authorTags.authorTags[0]);
			});

			it('returns brand as display tag and no genre prefix if the author is the same as the stream', () => {
				const content = Object.assign({ streamProperties: { idV1: 'XYZ' } }, primaryBrandTag, authorTags, isOpinion);
				subject = new Presenter(content);
				expect(subject.genrePrefix).to.be.null;
				expect(subject.displayTag).to.deep.equal(primaryBrandTag.primaryBrandTag);
			});

		});

	});

	context('advertiserPrefix', () => {

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

	context('timeStatus', () => {

		const FIFTY_NINE_MINUTES = 1000 * 60 * 59;
		const SIXTY_ONE_MINUTES = 1000 * 60 * 61;

		context('less than an hour since the article published', () => {

			it('returns new when publishedDate and initialPublishedDate are the same', () => {
				const fiftyNineMinutesAgo = Date.now() - FIFTY_NINE_MINUTES;
				const content = {
					publishedDate: fiftyNineMinutesAgo,
					initialPublishedDate: fiftyNineMinutesAgo
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.equal('new');
			});

			it('returns updated when published date and initialPublishedDate differ', () => {
				const content = {
					publishedDate: Date.now() - FIFTY_NINE_MINUTES,
					initialPublishedDate: Date.now() - SIXTY_ONE_MINUTES
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.equal('updated');
			});

		});

		context('more than an hour since the article published', () => {

			it('returns null', () => {
				const sixtyOneMinutesAgo = Date.now() - SIXTY_ONE_MINUTES;
				const content = {
					publishedDate: sixtyOneMinutesAgo,
					initialPublishedDate: sixtyOneMinutesAgo
				};
				subject = new Presenter(content);
				expect(subject.timeStatus()).to.be.null;
			});
		});

	});

	context('liveBlog', () => {

		context('status mapping', () => {

			it('returns status \'last post\' when \'inprogress\'', () => {
				const content = { status: 'InProgress' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('last post');
				expect(subject.liveBlog().classModifier).to.equal('inprogress');
			});

			it('returns status \'coming soon\' when \'comingsoon\'', () => {
				const content = { status: 'ComingSoon' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('coming soon');
				expect(subject.liveBlog().classModifier).to.equal('comingsoon');
			});

			it('returns status \'liveblog closed\' when \'closed\'', () => {
				const content = { status: 'Closed' };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('liveblog closed');
				expect(subject.liveBlog().classModifier).to.equal('closed');
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

	context('relatedContent', () => {

		it('returns the story package when one exists', () => {
			subject = new Presenter(articleStandardFixture);
			expect(subject.relatedContent.map(item => item.data)).to.deep.equal(articleStandardFixture.storyPackage);
		});

		it('returns latest content of primary tag when no story package, current article filtered', () => {
			subject = new Presenter(articleBrandFixture);
			expect(subject.relatedContent.length).to.equal(3);
			subject.relatedContent.map(content => {
				expect(content.data.id).to.not.equal(articleBrandFixture.id);
			});
		});

	});

	context('headshot', () => {

		it('returns the full headshot file url and author name when a headshot exists', () => {
			subject = new Presenter(articleOpinionAuthorFixture);
			expect(subject.headshot.url).to.equal('https://www.ft.com/__origami/service/image/v2/images/raw/fthead:gideon-rachman?source=next&width=150&fit=scale-down&compression=best&tint=054593,d6d5d3');
			expect(subject.headshot.alt).to.equal('Photo of Gideon Rachman');
		});

		it('returns null when headshot does not exist', () => {
			subject = new Presenter(articleBrandFixture);
			expect(subject.headshot).to.be.null;
		});

		context('author brand combo', () => {

			const primaryBrandTag = { primaryBrandTag: { prefLabel: 'brandName', taxonomy: 'brand', attributes: [] } };
			const authorTags = { authorTags: [ { prefLabel: 'authorName', attributes: [{key: 'headshot', value:'author-name'} ] } ] };
			const isOpinion = { isOpinion: true }

			it('returns a headshot when the author has one', () => {
				const content = Object.assign({}, primaryBrandTag, authorTags, isOpinion);
				subject = new Presenter(content);
				expect(subject.headshot.url).to.include('author-name');
			});

		});

	});

	context('displayTitle', () => {

		const promotionalTitle = { promotionalTitle: 'promotional' };
		const title = { title: 'title'};
		const flagOn = { flags: { teaserUsePromotionalTitle: true } };
		const flagOff = { flags: { teaserUsePromotionalTitle: false } };

		it('returns the promotional title if it exists and flag is on', () => {
			const content = Object.assign({}, title, promotionalTitle, flagOn);
			subject = new Presenter(content);
			expect(subject.displayTitle).to.equal('promotional');
		});

		it('returns the title if flag is off', () => {
			const content = Object.assign({}, title, promotionalTitle, flagOff);
			subject = new Presenter(content);
			expect(subject.displayTitle).to.equal('title');
		});

		it('returns the title if flag is on and no promotional title exists', () => {
			const content = Object.assign({}, title, flagOn);
			subject = new Presenter(content);
			expect(subject.displayTitle).to.equal('title');
		});

	});

	context('duration', () => {
		it('returns null when data is not available', () => {
			subject = new Presenter({});
			expect(subject.duration).to.be.null;
		});

		it('returns an object when data is available', () => {
			subject = new Presenter(videoFixture);
			expect(subject.duration).to.be.an('object');
		});

		it('returns the duration in ISO8601 format', () => {
			subject = new Presenter(videoFixture);
			expect(subject.duration.iso).to.equal('PT4M30S');
		});

		it('returns the duration in mm:ss format', () => {
			subject = new Presenter(videoFixture);
			expect(subject.duration.formatted).to.equal('4:30');
		});

		it('returns the duration in original MS format', () => {
			subject = new Presenter(videoFixture);
			expect(subject.duration.ms).to.equal(270655);
		});
	});

});
