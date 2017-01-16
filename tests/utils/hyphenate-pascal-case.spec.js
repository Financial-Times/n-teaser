require('chai').should();

const hyphenatePascalCase = require('../../src/utils/hyphenate-pascal-case');

describe('Utils', () => {

	describe('Hyphenate Pascal Case', () => {

		it('should exist', () => {
			hyphenatePascalCase.should.exist;
		});

		it('should hyphenate pascal case, e.g. `FooBar` to `foo-bar`', () => {
			hyphenatePascalCase('FooBar').should.equal('foo-bar');
		});

		it('should handle a single ‘word’', () => {
			hyphenatePascalCase('Foo').should.equal('foo');
		});

	});

});
