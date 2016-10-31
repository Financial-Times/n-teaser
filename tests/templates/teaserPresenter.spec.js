const expect = require('chai').expect;
const Presenter = require('../../templates/teaserPresenter');
const articleBrandFixture = require('../fixtures/article-brand-fixture');
const articleOpinionAuthorFicture = require('../fixtures/article-opinion-author-fixture');
const articleStandardFixture = require('../fixtures/article-standard-fixture');

describe('Teaser Presenter', () => {

	let subject;

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
				const subject = new Presenter(content);
				expect(subject.timeStatus()).to.equal('new');
			});

			it('returns updated when published date and initialPublishedDate differ', () => {
				const content = {
					publishedDate: Date.now() - FIFTY_NINE_MINUTES,
					initialPublishedDate: Date.now() - SIXTY_ONE_MINUTES
				};
				const subject = new Presenter(content);
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
				const subject = new Presenter(content);
				expect(subject.timeStatus()).to.be.null;
			});
		});

	});

});
