const { isPackage } = require('../../lib/utils');

const package = input => {
	if (input.flags && input.flags.teaserUsePromotionalTitle && input.promotionalTitle) {
		return input.promotionalTitle;
	}
	return input.title;
}

const teaser = input => {
	if (input.flags && input.flags.headlineTesting && input.flags.headlineTesting === 'variant' && input.alternativeTitles && input.alternativeTitles.contentPackageTitle) {
		return input.alternativeTitles.contentPackageTitle;
	} else if (input.flags && input.flags.teaserUsePromotionalTitle && input.promotionalTitle) {
		return input.promotionalTitle;
	}
	return input.title;
}

module.exports = input => isPackage(input) ? package(input) : teaser(input);
