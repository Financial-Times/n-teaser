const expect = require('chai').expect;
const Presenter = require('../../presenters/teaser-presenter');
const articleBrandFixture = require('../fixtures/article-brand-fixture');
const articleOpinionAuthorFixture = require('../fixtures/article-opinion-author-fixture');
const articleStandardFixture = require('../fixtures/article-standard-fixture');

describe('Teaser Presenter', () => {

	let subject;

	context('classModifiers', () => {

		it('passes through modifiers from collection', () => {
			const content = {mods: ['mod1', 'mod2']};
			subject = new Presenter(content);
			expect(subject.classModifiers()).to.deep.equal(content.mods);
		});

		it('returns an empty array if there is no relevant data', () => {
			const content = {};
			subject = new Presenter(content);
			expect(subject.classModifiers().length).to.equal(0);
		});

		it('adds a modifier equal to the size property if it exists', () => {
			const content = {size: 'this-is-a-size'};
			subject = new Presenter(content);
			expect(subject.classModifiers()[0]).to.deep.equal(content.size);
		});

		context('has-headshot', () => {

			it('returns has-headshot when correct template and has-headshot', () => {
				const content = Object.assign({}, articleOpinionAuthorFixture, {template: 'standard'});
				subject = new Presenter(content);
				expect(subject.classModifiers()).to.deep.equal(['has-headshot']);
			});

			it('does not add a modifier if wrong template but has headshot', () => {
				const content = Object.assign({}, articleOpinionAuthorFixture, {template: 'no-headshot'});
				subject = new Presenter(content);
				expect(subject.classModifiers().length).to.equal(0);
			});

			it('does not add a modifier if correct template but does not have a headshot', () => {
				const content = {template: 'light'};
				subject = new Presenter(content);
				expect(subject.classModifiers().length).to.equal(0);
			});

		});

		context('has-image', () => {
			it('returns has-image when correct template and there is a mainImage', () => {
				const content = {mainImage: true, template: 'heavy'};
				subject = new Presenter(content);
				expect(subject.classModifiers()).to.deep.equal(['has-image']);
			});

			it('does not add a modifier if wrong template but has mainImage', () => {
				const content = {mainImage: true, template: 'standard'};
				subject = new Presenter(content);
				expect(subject.classModifiers().length).to.equal(0);
			});

			it('does not add a modifier if correct template but does not have a mainImage', () => {
				const content = {template: 'heavy'};
				subject = new Presenter(content);
				expect(subject.classModifiers().length).to.equal(0);
			});
		});

	});

	context('displayTag', () => {

		const primaryBrandTag = { primaryBrandTag: { primaryBrandTag: true } };
		const teaserTag = { teaserTag: { teaserTag: true } };

		it('returns the primaryBrandTag when it exists', () => {
			const content = Object.assign({}, primaryBrandTag, teaserTag);
			subject = new Presenter(content);
			expect(subject.displayTag().primaryBrandTag).to.be.true;
		});

		it('returns the teaserTag when it exists and when primaryBrandTag does not', () => {
			const content = Object.assign({}, teaserTag);
			subject = new Presenter(content);
			expect(subject.displayTag().teaserTag).to.be.true;
		});

		it('returns null if neither the primaryBrandTag nor teaserTag exist', () => {
			const content = {};
			subject = new Presenter(content);
			expect(subject.displayTag()).to.be.null;
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
				const content = { liveBlog: { status: 'inprogress' } };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('last post');
				expect(subject.liveBlog().classModifier).to.equal('inprogress');
			});

			it('returns status \'coming soon\' when \'comingsoon\'', () => {
				const content = { liveBlog: { status: 'comingsoon' } };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('coming soon');
				expect(subject.liveBlog().classModifier).to.equal('comingsoon');
			});

			it('returns status \'liveblog closed\' when \'closed\'', () => {
				const content = { liveBlog: { status: 'closed' } };
				subject = new Presenter(content);
				expect(subject.liveBlog().status).to.equal('liveblog closed');
				expect(subject.liveBlog().classModifier).to.equal('closed');
			});

		});

	});

	context('relatedContent', () => {

		it('returns the story package when one exists', () => {
			subject = new Presenter(articleStandardFixture);
			expect(subject.relatedContent()).to.deep.equal(articleStandardFixture.storyPackage);
		});

		it('returns latest content of primary tag when no story package, current article filtered', () => {
			subject = new Presenter(articleBrandFixture);
			const relatedContent = subject.relatedContent();
			expect(relatedContent.length).to.equal(3);
			relatedContent.map(content => {
				expect(content.id).to.not.equal(articleBrandFixture.id);
			});
		});

	});

	context('headshot', () => {

		it('returns the full headshot file url and author name when a headshot exists', () => {
			subject = new Presenter(articleOpinionAuthorFixture);
			expect(subject.headshot().src).to.equal('https://www.ft.com/__origami/service/image/v2/images/raw/fthead:gideon-rachman?source=next&fit=scale-down&compression=best&width=75&tint=054593,fff1e0');
			expect(subject.headshot().alt).to.equal('Gideon Rachman');
		});

		it('returns null when headshot does not exist', () => {
			subject = new Presenter(articleBrandFixture);
			expect(subject.headshot()).to.be.null;
		});

	});

});
