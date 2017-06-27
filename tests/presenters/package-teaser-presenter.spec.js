const expect = require('chai').expect;
const Presenter = require('../../src/presenters/package-teaser-presenter');
const packageFixture = require('../fixtures/package-fixture');

describe('Package Teaser Presenter', () => {

	let subject;

	context('classModifiers', () => {

		it('passes through modifiers from collection', () => {
			const content = {mods: ['mod1', 'mod2']};
			subject = new Presenter(content);
			expect(subject.classModifiers).to.deep.equal(content.mods);
		});

		it('adds a syndication modifier if the given article is available for syndication', () => {
			const content = {canBeSyndicated:'yes'};
			subject = new Presenter(content);
			expect(subject.classModifiers[1]).to.deep.equal('syndicatable');
		});

		it('adds a syndication modifier if the given article is NOT available for syndication', () => {
			const content = {canBeSyndicated:'no'};
			subject = new Presenter(content);
			expect(subject.classModifiers[1]).to.deep.equal('not-syndicatable');
		});

		context('has theme', () => {

			it('returns extra-package when package theme is extra', () => {
				subject = new Presenter(packageFixture);
				expect(subject.classModifiers).to.include('extra-package');
			});

			it('returns basic-package when package theme is basic', () => {
				const content = Object.assign({}, packageFixture, { design: { theme: 'basic'} });
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('basic-package');
			});

			it('returns special-report-package when package theme is special-report', () => {
				const content = Object.assign({}, packageFixture, { design: { theme: 'special-report'} });
				subject = new Presenter(content);
				expect(subject.classModifiers).to.include('special-report-package');
			});

		});
	});

	context('genrePrefix', () => {

		it('returns null if there is no package brand', () => {
			const content = {};
			subject = new Presenter(content);
			expect(subject.genrePrefix).to.be.undefined;
		});

		it('is FT Series', () => {
			subject = new Presenter(packageFixture);
			expect(subject.genrePrefix).to.equal('FT Series');
		});

		it('is Special Report', () => {
			const content = Object.assign({}, packageFixture, { brandConcept: { prefLabel: 'Special Report' } });
			subject = new Presenter(content);
			expect(subject.genrePrefix).to.equal('Special Report');
		});

	});

	context('packageContent', () => {

		it('returns the three items in package list', () => {
			subject = new Presenter(packageFixture);
			expect(subject.packageContent.length).to.equal(3);
		});

		it('returns the title of items in package list', () => {
			subject = new Presenter(packageFixture);
			subject.packageContent.map(content => {
				expect(content.title).to.equal(packageFixture.contains[packageFixture.contains.indexOf(content)].title);
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
});
