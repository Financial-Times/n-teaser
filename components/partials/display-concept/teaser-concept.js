const { brandAuthorDouble } = require('../../lib/utils');

module.exports = input => {
	//use package title as display concept if article belongs to package
	let packageArticle = input.containedIn;

	const displayConcept = input.flags && input.flags.noTeaserConcepts ? null : input.displayConcept;

	if (packageArticle && packageArticle[0] && packageArticle[0].title) {
		return Object.assign(this, { prefLabel: packageArticle[0].title, relativeUrl: packageArticle[0].relativeUrl});
	} else {
		// Use Display concept if Brand concept is the same as stream
		if (input.streamProperties &&
			input.streamProperties.id &&
			input.brandConcept &&
			input.streamProperties.id === input.brandConcept.id) {
			return displayConcept || null;
		}
		// Use Author Concept if Opinion & Branded unless same as stream
		if (brandAuthorDouble(input) === true &&
			(!input.streamProperties ||
			(input.streamProperties &&
			input.streamProperties.id !== input.authorConcepts[0].id ))) {
			return input.authorConcepts[0];
		}

		return input.brandConcept || displayConcept || null;
	}
}
