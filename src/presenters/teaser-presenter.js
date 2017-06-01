'use strict';

const hyphenatePascalCase = require('../utils/hyphenate-pascal-case');

const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_WIDTH = 75;
const HEADSHOT_URL_PARAMETERS = `?source=next&width=${HEADSHOT_WIDTH * 2}&fit=scale-down&compression=best&tint=054593,d6d5d3`;
const TEMPLATES_WITH_HEADSHOTS = ['light','standard','lifestyle'];
const TEMPLATES_WITH_IMAGES = ['heavy', 'top-story-heavy','lifestyle'];
const LIVEBLOG_MAPPING = {
	inprogress: {
		timestampStatus: 'last post',
		labelModifier: 'live'
	},
	comingsoon: {
		timestampStatus: 'coming soon',
		labelModifier: 'pending'
	},
	closed: {
		timestampStatus: 'liveblog closed',
		labelModifier: 'closed'
	}
};

const brandAuthorDouble = (data) => {
	if (
		data.authorConcepts &&
		data.authorConcepts.length &&
		data.isOpinion === true
	) {
		return true;
	}
		return false;
};

const modsDoesNotInclude = (modToTest, modsArray) => {
	if (!modsArray) return true;
	return modsArray.indexOf(modToTest) === -1;
};

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
	}

	// returns all top level class names appropriate for the teaser
	get classModifiers () {
		const mods = [].concat(this.data.mods || []);

		if (this.data.containedIn && this.data.containedIn.length) {
			const { theme } = this.data.containedIn[0].design || {};

			if (theme && (theme === 'extra-wide' || theme === 'extra')) {
				mods.push('extra-article');
			// overrides special report teaser styling on package landing page
			} else if (!this.data.isLandingPage && theme === 'special-report') {
				mods.push('highlight');
			}
		}

		if (
			!this.data.noHeadshot &&
			this.headshot &&
			TEMPLATES_WITH_HEADSHOTS.some(template => template === this.data.template)
		) {
			mods.push('has-headshot');
		}

		if (this.data.size) mods.push(this.data.size);

		if (this.data.mainImage &&
			TEMPLATES_WITH_IMAGES.some(template => template === this.data.template) ) {
			mods.push('has-image');
		}

		if (this.data.isOpinion && modsDoesNotInclude('hero-image', this.data.mods)) {
			mods.push('opinion');
		}

		if (this.data.isEditorsChoice && modsDoesNotInclude('hero-image', this.data.mods)) {
			mods.push('highlight');
		}

		if (this.data.type) {
			mods.push(hyphenatePascalCase(this.data.type));
		}

		switch (this.data.canBeSyndicated) {
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

	//returns concept to be displayed
	get teaserConcept () {
		//use package title as display concept if article belongs to package
		let packageArticle = this.data.containedIn
		if (packageArticle && packageArticle[0] && packageArticle[0].title) {
			return Object.assign(this, { prefLabel: packageArticle[0].title, relativeUrl: packageArticle[0].relativeUrl});
		} else {
			// Use Display concept if Brand concept is the same as stream
			if (this.data.streamProperties &&
				this.data.streamProperties.id &&
				this.data.brandConcept &&
				this.data.streamProperties.id === this.data.brandConcept.id) {
				return this.data.displayConcept || null;
			}
			// Use Author Concept if Opinion & Branded unless same as stream
			if (brandAuthorDouble(this.data) === true &&
				(!this.data.streamProperties ||
				(this.data.streamProperties &&
				this.data.streamProperties.id !== this.data.authorConcepts[0].id ))) {
				return this.data.authorConcepts[0];
			}
			return this.data.brandConcept || this.data.displayConcept || null;
		}
	}

	//returns genre prefix
	get genrePrefix () {
		//use package brand if article belongs to package
		let packageArticle = this.data.containedIn
		if (packageArticle && packageArticle[0] && packageArticle[0].title && packageArticle[0].brandConcept) {
			return packageArticle[0].brandConcept.prefLabel;
		} else {
			if (brandAuthorDouble(this.data) === true) {
				// dedupe authors who are also brands and where Author = stream
				if (this.data.brandConcept &&
					this.data.brandConcept.prefLabel !== this.data.authorConcepts[0].prefLabel &&
					(!this.data.streamProperties ||
					(this.data.streamProperties &&
					this.data.streamProperties.id !== this.data.authorConcepts[0].id))) {
					return this.data.brandConcept.prefLabel;
				}
			}
			// Do not show a genre prefix against brands
			if (!this.data.genreConcept || this.data.brandConcept === this.teaserConcept) {
				return null;
			}
			// Do not show a prefix if the stream is a special report
			if (this.data.genreConcept && this.data.genreConcept.prefLabel === 'Special Report' &&
				this.data.streamProperties &&
				this.data.streamProperties.directType === 'http://www.ft.com/ontology/SpecialReport') {
				return null;
			}
			return this.data.genreConcept.prefLabel;
		}
	}

	//returns publishedDate, status, classModifier
	get timeObject () {
		if (this.data.status) {
			return this.liveBlog();
		} else {
			return {
				publishedDate: this.data.publishedDate,
				status: this.timeStatus(),
				classModifier: this.timeStatus()
			}
		}
	}

	// returns an array of content items related to the main article
	get relatedContent () {
		let relatedContent = [];
		if (Array.isArray(this.data.curatedRelatedContent) && this.data.curatedRelatedContent.length > 0) {
			relatedContent = this.data.curatedRelatedContent;
		} else if (this.data.displayConcept && Array.isArray(this.data.displayConcept.latestContent)) {
			relatedContent = this.data.displayConcept.latestContent.filter(content => content.id !== this.data.id);
		}

		return relatedContent
			.slice(0, MAX_RELATED_CONTENT)
			.map(item => ({ data: item, classModifiers: [hyphenatePascalCase(item.type)] }))
	}

	// returns url and name for author headshot when brand concept is an author with a headshot
	get headshot () {
		let fileName;
		let concept;

		if (this.data.brandConcept
			&& this.data.brandConcept.attributes
			&& this.data.brandConcept.attributes.length > 0
		) {
			fileName = this.data.brandConcept.attributes[0].value;
			concept = this.data.brandConcept;
		}
		if ((brandAuthorDouble(this.data) === true)
			&& this.data.authorConcepts.length > 0
			&& this.data.authorConcepts[0].attributes
			&& this.data.authorConcepts[0].attributes.length > 0
		) {
			fileName = this.data.authorConcepts[0].attributes[0].value;
			concept = this.data.authorConcepts[0];
		}

		if (fileName) {
			return {
				url: `${HEADSHOT_BASE_URL}${fileName}${HEADSHOT_URL_PARAMETERS}`,
				width: HEADSHOT_WIDTH,
				height: HEADSHOT_WIDTH,
				sizes: HEADSHOT_WIDTH,
				widths: [HEADSHOT_WIDTH, 2 * HEADSHOT_WIDTH],
				alt: `Photo of ${concept.prefLabel}`
			};
		} else {
			return null;
		}
	}

	// returns class modifier for live blog label
	get liveBlogLabelModifier () {
		return LIVEBLOG_MAPPING[this.data.status.toLowerCase()].labelModifier;
	}

	// returns title either standard or promotional based on flag
	get displayTitle () {
		if (this.data.flags && this.data.flags.teaserUsePromotionalTitle && this.data.promotionalTitle) {
			return this.data.promotionalTitle;
		}
		return this.data.title;
	}

	get advertiserPrefix () {
		if (this.data.advertiser) {
			if (this.data.type === 'promoted-content') {
				return ' paid for by ';
			} else {
				return ' by ';
			}
		} else {
			return '';
		}
	}

	//returns prefix for timestamp (null / 'new' / 'updated')
	timeStatus () {
		const now = Date.now();
		const publishedDate = new Date(this.data.publishedDate).getTime();
		const firstPublishedDate = new Date(this.data.firstPublishedDate).getTime();
		let status = null;
		if (now - publishedDate < ONE_HOUR) {
			if (publishedDate === firstPublishedDate) {
				status = 'new';
			} else {
				status = 'updated';
			}
		}
		return status
	}

	// returns publishedDate, status, classModifier
	liveBlog () {
		return {
			publishedDate: this.data.updates && this.data.updates[0].date,
			status: LIVEBLOG_MAPPING[this.data.status.toLowerCase()].timestampStatus,
			classModifier: this.data.status.toLowerCase()
		}
	}

	get duration () {
		if (this.data.duration) {
			const date = new Date(this.data.duration);

			return {
				// https://en.wikipedia.org/wiki/ISO_8601#Durations
				iso: `PT${date.getMinutes()}M${date.getSeconds()}S`,
				ms: this.data.duration,
				formatted: this.data.formattedDuration
			};
		} else {
			return null;
		}
	}
};

module.exports = TeaserPresenter;
