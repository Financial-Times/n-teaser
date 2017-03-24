'use strict';

// const hyphenatePascalCase = require('../utils/hyphenate-pascal-case');

const MAX_RELATED_CONTENT = 3;

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
	}

	// returns all top level class names appropriate for the teaser
	get classModifiers () {
		const theme = this.data.design.theme;
		const mods = this.data.mods || [];

		if (this.data.size) mods.push(this.data.size);

		if (theme && (theme === 'extra-wide' || theme === 'extra')) {
			mods.push('extra');
		} else if (theme) {
			mods.push(theme);
		}
		// if (this.data.type) {
		// 	mods.push(hyphenatePascalCase(this.data.type));
		// }
		if (this.data.canBeSyndicated === 'yes') {
			mods.push('syndicatable');
		} else if(this.data.canBeSyndicated === 'no') {
			mods.push('not-syndicatable');
		}
		return mods;
	}

	//returns tag to be displayed
	get displayTag () {
		const theme = this.data.design.theme
		// // Use Primary Tag is Primary Brand Tag the same as stream
		// if (this.data.streamProperties &&
		// 	this.data.streamProperties.idV1 &&
		// 	this.data.primaryBrandTag &&
		// 	this.data.streamProperties.idV1 === this.data.primaryBrandTag.idV1) {
		// 	return this.data.primaryTag || null;
		// }
		// // Use Author Tag if Opinion & Branded unless same as stream
		// if (brandAuthorDouble(this.data) === true &&
		// 	(!this.data.streamProperties ||
		// 	(this.data.streamProperties &&
		// 	this.data.streamProperties.idV1 !== this.data.authorTags[0].idV1 ))) {
		// 	return this.data.authorTags[0];
		// }
		// return this.data.primaryBrandTag || this.data.teaserTag || null;

		// TODO: make this less brittle when this whole thing is figured out.
		if (theme === 'special-report') {
			return 'Special Report'
		} else {
			return 'FT Series'
		}
	}

	//returns genre prefix
	// get genrePrefix () {
	// 	if (brandAuthorDouble(this.data) === true) {
	// 		// dedupe authors who are also brands and where Author = stream
	// 		if (this.data.primaryBrandTag.prefLabel !== this.data.authorTags[0].prefLabel &&
	// 			(!this.data.streamProperties ||
	// 			(this.data.streamProperties &&
	// 			this.data.streamProperties.idV1 !== this.data.authorTags[0].idV1))) {
	// 			return this.data.primaryBrandTag.prefLabel;
	// 		}
	// 	}
	// 	// Do not show a genre prefix against brands
	// 	if (!this.data.genreTag || this.data.primaryBrandTag === this.displayTag) {
	// 		return null;
	// 	}
	// 	// Do not show a prefix if the stream is a special report
	// 	if (this.data.genreTag && this.data.genreTag.prefLabel === 'Special Report' &&
	// 		this.data.streamProperties &&
	// 		this.data.streamProperties.taxonomy === 'specialReports') {
	// 		return null;
	// 	}
	// 	return this.data.genreTag.prefLabel;
	// }


	// returns an array of content items related to the main article
	get packageContent () {
		let packageContent = [];
		if (Array.isArray(this.data.contains) && this.data.contains.length > 0) {
			packageContent = this.data.contains;
		}

		return packageContent
			.slice(0, MAX_RELATED_CONTENT)
	}

	// returns title either standard or promotional based on flag
	get displayTitle () {
		if (this.data.flags && this.data.flags.teaserUsePromotionalTitle && this.data.promotionalTitle) {
			return this.data.promotionalTitle;
		}
		return this.data.title;
	}
};

module.exports = TeaserPresenter;
