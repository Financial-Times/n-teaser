// returns all top level class names appropriate for the teaser

const { isPackage, hyphenatePascalCase } = require('./utils');

const TEMPLATES_WITH_HEADSHOTS = ['light', 'standard', 'lifestyle'];
const PLAYABLE_VIDEO_INVALID_MODS = ['centre', 'has-image'];
const TEMPLATES_WITH_IMAGES = ['heavy', 'top-story-heavy','lifestyle'];
const additionalMods = {
	'top-story-heavy': ['top-story', 'landscape'],
	'top-story-standard': ['top-story', 'standalone']
};

const modsDoesNotInclude = (modToTest, modsArray = []) => {
	return !modsArray.includes(modToTest);
};

const teaser = (input, template) => {


	const mods = [].concat(additionalMods[template] || [], input.mods || []);
	if (input.containedIn && input.containedIn.length) {
		const { theme } = input.containedIn[0].design || {};

		if (theme && (theme === 'extra-wide' || theme === 'extra')) {
			mods.push('extra-article');
		// overrides special report teaser styling on package landing page
		} else if (!input.isLandingPage && theme === 'special-report') {
			mods.push('highlight');
		}
	}

	if (
		!input.noHeadshot &&
		this.headshot &&
		TEMPLATES_WITH_HEADSHOTS.includes(template)
	) {
		mods.push('has-headshot');
	}

	if (input.size) mods.push(input.size);

	// if it's an in-situ video card, don't add the overflowing image effect!
	if (input.mainImage && TEMPLATES_WITH_IMAGES.includes(template)) {
		mods.push('has-image');
	}

	if (input.isOpinion && modsDoesNotInclude('hero-image', input.mods)) {
		mods.push('opinion');
	}

	if (input.isEditorsChoice && modsDoesNotInclude('hero-image', input.mods)) {
		mods.push('highlight');
	}

	if (this.isPlayableVideo) {
		mods.push('big-video');

		// don't allow these mods! (mutates original array)
		PLAYABLE_VIDEO_INVALID_MODS.forEach((invalid) => {
			const i = mods.indexOf(invalid);
			i > -1 && mods.splice(i, 1);
		});
	}

	if (input.type) {
		mods.push(hyphenatePascalCase(input.type));
	}

	switch (input.canBeSyndicated) {
		case 'yes':
			mods.push('syndicatable');
			break;
		case 'no':
			mods.push('not-syndicatable');
			break;
		case 'verify':
			mods.push('verify-syndicatable');
			break;
	}

	return mods;
}

const package = input => {
	const mods = input.mods || [];
	const theme = input.design ? input.design.theme : 'basic';

	if (theme && (theme === 'extra-wide' || theme === 'extra')) {
		mods.push('extra-package');
	} else if (theme) {
		mods.push(`${theme}-package`);
	}

	if (input.canBeSyndicated === 'yes') {
		mods.push('syndicatable');
	} else if(input.canBeSyndicated === 'no') {
		mods.push('not-syndicatable');
	}
	return mods;
}

module.exports = (input, template) => isPackage(input) ? package(input, template) : teaser(input, template);
