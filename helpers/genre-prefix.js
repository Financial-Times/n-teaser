const { isPackage, brandAuthorDouble } = require('./utils');

const allowedGenres = [
	'61d707b5-6fab-3541-b017-49b72de80772',
	'9c2af23a-ee61-303f-97e8-2026fb031bd5',
	'dc9332a7-453d-3b80-a53d-5a19579d9359',
	'b3ecdf0e-68bb-3303-8773-ec9c05e80234',
	'3094f0a9-1e1c-3ec3-b7e3-4d4885a826ed'
];

const teaser = input => {
	const genre = (input.genreConcept && allowedGenres.includes(input.genreConcept.id)) ? input.genreConept : undefined;
	//use package brand if article belongs to package
	let packageArticle = input.containedIn;

	if (packageArticle && packageArticle[0] && packageArticle[0].title && packageArticle[0].brand) {
		return packageArticle[0].brand.prefLabel;
	}

	if (input.type === 'Video') {
		return 'Video';
	}

	if (brandAuthorDouble(input) === true) {
		// dedupe authors who are also brands and where Author = stream
		if (input.brandConcept &&
			input.brandConcept.prefLabel !== input.authorConcepts[0].prefLabel &&
			(!input.streamProperties ||
			(input.streamProperties &&
			input.streamProperties.id !== input.authorConcepts[0].id))) {
			return input.brandConcept.prefLabel;
		}
	}

	// Do not show a genre prefix against brands
	if (!genre || input.brandConcept === this.teaserConcept) {
		return null;
	}

	// Do not show a prefix if the stream is a special report
	if (genre && input.genreConcept.prefLabel === 'Special Report' &&
		input.streamProperties &&
		input.streamProperties.directType === 'http://www.ft.com/ontology/SpecialReport') {
		return null;
	}

	return input.genreConcept.prefLabel;
}

const package = input => {
	if (input.brandConcept) {
		if (input.brandConcept.prefLabel === 'Special Report' || input.brandConcept.prefLabel === 'FT Series') {
			return input.brandConcept.prefLabel;
		}
	}
}

module.exports = input => isPackage(input) ? package(input) : teaser(input);
