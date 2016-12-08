require('chai').should();

const hyphenatePascalCase = require('../../src/utils/hyphenate-pascal-case');

describe('Utils', () => {

	describe('Hyphenate Pascal Case', () => {

		it('should exist', () => {
			hyphenatePascalCase.should.exist;
		});

	});

});
