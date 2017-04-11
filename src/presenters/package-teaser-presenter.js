'use strict';

const MAX_LIST_CONTENT = 3;

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
		this.data.isPremium = false;
	}

	// returns all top level class names appropriate for the teaser
	get classModifiers () {
		const theme = this.data.design.theme;
		const mods = this.data.mods || [];

		if (theme && (theme === 'extra-wide' || theme === 'extra')) {
			mods.push('extra-package');
		} else if (theme) {
			mods.push(`${theme}-package`);
		}

		if (this.data.canBeSyndicated === 'yes') {
			mods.push('syndicatable');
		} else if(this.data.canBeSyndicated === 'no') {
			mods.push('not-syndicatable');
		}
		return mods;
	}

	//returns FT Series or Special Reports
	get genrePrefix () {
		if (this.data.primaryBrandTag) {
			if (this.data.primaryBrandTag.prefLabel === 'Special Reports' || this.data.primaryBrandTag.prefLabel === 'FT Series') {
				return this.data.primaryBrandTag.prefLabel;
			}
		}
	}

	// returns an array of content items related to the main article
	get packageContent () {
		let packageContent = [];
		if (Array.isArray(this.data.contains) && this.data.contains.length > 0) {
			packageContent = this.data.contains;
		}

		return packageContent
			.slice(0, MAX_LIST_CONTENT)
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
