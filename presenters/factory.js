const TeaserPresenter = require('../presenters/teaser-presenter');
const PackagePresenter = require('../presenters/package-teaser-presenter');

module.exports = (input) => {
	let nTeaserPresenter;
	if (input.canBePackage && input.type.toLowerCase() === 'package') {
		nTeaserPresenter = new PackagePresenter(input);
	} else {
		nTeaserPresenter = new TeaserPresenter(input);
	}
	input.presenter = nTeaserPresenter;
	return nTeaserPresenter;
};
