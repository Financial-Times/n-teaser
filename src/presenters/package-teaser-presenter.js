'use strict';

const MAX_LIST_CONTENT = 3;

class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
		this.data.isPremium = false;
	}

	// returns all top level class names appropriate for the teaser
	get classModifiers () {
		const mods = this.data.mods || [];
		const theme = this.data.design ? this.data.design.theme : 'basic';

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
		if (this.data.brandConcept) {
			if (this.data.brandConcept.prefLabel === 'Special Report' || this.data.brandConcept.prefLabel === 'FT Series') {
				return this.data.brandConcept.prefLabel;
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
			.slice(0, MAX_LIST_CONTENT);
	}

	// returns title either standard or promotional based on flag
	get displayTitle () {
		return this.data.promotionalTitle || this.data.title;
	}

	get displayStandfirst () {
		//Note: although everywhere else we prefer the promotional version for teasers, we can't do that for standfirsts because the promotionalStandfirst is used for the App Skyline.
		//So we will only use the promotionalStandfirst if there is no standfirst
		return this.data.standfirst || this.data.promotionalStandfirst;
	}

	get displayImage () {
		return this.data.promotionalImage || this.data.mainImage;
	}

};

module.exports = TeaserPresenter;
