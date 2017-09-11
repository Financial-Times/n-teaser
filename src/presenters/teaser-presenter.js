'use strict';

const hyphenatePascalCase = require('../utils/hyphenate-pascal-case');

const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_WIDTH = 75;
const HEADSHOT_URL_PARAMETERS = `?source=next&width=${HEADSHOT_WIDTH * 2}&fit=scale-down&compression=best&tint=054593,d6d5d3`;
const TEMPLATES_WITH_HEADSHOTS = ['light', 'standard', 'lifestyle'];
const TEMPLATES_WITH_IMAGES = ['heavy', 'top-story-heavy','lifestyle'];
const PLAYABLE_VIDEO_INVALID_MODS = ['centre', 'has-image'];
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
		data.authors &&
		data.authors.length &&
		data.isOpinion === true
	) {
		return true;
	}
		return false;
};

const modsDoesInclude = (modToTest, modsArray = []) => {
	return modsArray.includes(modToTest);
};

const modsDoesNotInclude = (modToTest, modsArray = []) => {
	return !modsArray.includes(modToTest);
};

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
		const allowedGenres = [
			'61d707b5-6fab-3541-b017-49b72de80772',
			'9c2af23a-ee61-303f-97e8-2026fb031bd5',
			'dc9332a7-453d-3b80-a53d-5a19579d9359',
			'b3ecdf0e-68bb-3303-8773-ec9c05e80234',
			'3094f0a9-1e1c-3ec3-b7e3-4d4885a826ed'
		];
		this.genre = (this.data.genre && allowedGenres.includes(this.data.genre.id)) ? this.data.genre : undefined;
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
			TEMPLATES_WITH_HEADSHOTS.includes(this.data.template)
		) {
			mods.push('has-headshot');
		}

		if (this.data.size) mods.push(this.data.size);

		// if it's an in-situ video card, don't add the overflowing image effect!
		if (this.data.mainImage && TEMPLATES_WITH_IMAGES.includes(this.data.template)) {
			mods.push('has-image');
		}

		if (this.data.isOpinion && modsDoesNotInclude('hero-image', this.data.mods)) {
			mods.push('opinion');
		}

		if (this.data.isEditorsChoice && modsDoesNotInclude('hero-image', this.data.mods)) {
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
		let packageArticle = this.data.containedIn;

		const displayConcept = this.data.displayConcept;

		if (packageArticle && packageArticle[0] && packageArticle[0].title) {
			return Object.assign(this, { prefLabel: packageArticle[0].title, relativeUrl: packageArticle[0].relativeUrl});
		} else {
			// Use Display concept if Brand concept is the same as stream
			if (this.data.streamProperties &&
				this.data.streamProperties.id &&
				this.data.brandConcept &&
				this.data.streamProperties.id === this.data.brandConcept.id) {
				return displayConcept || null;
			}
			// Use Author Concept if Opinion & Branded unless same as stream
			if (brandAuthorDouble(this.data) === true &&
				(!this.data.streamProperties ||
				(this.data.streamProperties &&
				this.data.streamProperties.id !== this.data.authors[0].id ))) {
				return this.data.authors[0];
			}
			return this.data.brandConcept || displayConcept || null;
		}
	}

	//returns genre prefix
	get genrePrefix () {
		//use package brand if article belongs to package
		let packageArticle = this.data.containedIn;

		if (packageArticle && packageArticle[0] && packageArticle[0].title && packageArticle[0].brand) {
			return packageArticle[0].brand.prefLabel;
		}

		if (this.data.type === 'Video') {
			return 'Video';
		}

		if (brandAuthorDouble(this.data) === true) {
			// dedupe authors who are also brands and where Author = stream
			if (this.data.brandConcept &&
				this.data.brandConcept.prefLabel !== this.data.authors[0].prefLabel &&
				(!this.data.streamProperties ||
				(this.data.streamProperties &&
				this.data.streamProperties.id !== this.data.authors[0].id))) {
				return this.data.brandConcept.prefLabel;
			}
		}

		// Do not show a genre prefix against brands
		if (!this.genre || this.data.brandConcept === this.teaserConcept) {
			return null;
		}

		// Do not show a prefix if the stream is a special report
		if (this.genre && this.data.genre.prefLabel === 'Special Report' &&
			this.data.streamProperties &&
			this.data.streamProperties.directType === 'http://www.ft.com/ontology/SpecialReport') {
			return null;
		}

		// Do not show a genre prefix against brands
		if (!this.genre || this.data.brand === this.teaserConcept) {
			return null;
		}

		// Do not show a prefix if the stream is a special report
		if (this.genre && this.data.genre.prefLabel === 'Special Report' &&
			this.data.streamProperties &&
			this.data.streamProperties.directType === 'http://www.ft.com/ontology/SpecialReport') {
			return null;
		}

		return this.data.genre.prefLabel;
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
			};
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
			.map(item => ({ data: item, classModifiers: [hyphenatePascalCase(item.type)] }));
	}

	// returns url and name for author headshot when brand concept is an author with a headshot
	get headshot () {
		let headshotName;
		let author;

		if ((brandAuthorDouble(this.data) === true)
			&& this.data.authors.length > 0
			&& this.data.authors[0].headshot
		) {
			headshotName = this.data.authors[0].headshot.name;
			author = this.data.authors[0];
		}

		if (headshotName) {
			return {
				url: `${HEADSHOT_BASE_URL}fthead:${headshotName}${HEADSHOT_URL_PARAMETERS}`,
				width: HEADSHOT_WIDTH,
				height: HEADSHOT_WIDTH,
				sizes: HEADSHOT_WIDTH,
				widths: [HEADSHOT_WIDTH, 2 * HEADSHOT_WIDTH],
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
		if (this.data.flags && this.data.flags.headlineTesting && this.data.flags.headlineTesting === 'variant' && this.data.alternativeTitles && this.data.alternativeTitles.contentPackageTitle) {
			return this.data.alternativeTitles.contentPackageTitle;
		} else if (this.data.flags && this.data.flags.teaserUsePromotionalTitle && this.data.promotionalTitle) {
			return this.data.promotionalTitle;
		}
		return this.data.title;
	}

	// returns the variant name if headline testing is live for this story
	get headlineTestingVariant () {
		if (this.data.flags && this.data.flags.headlineTesting && this.data.alternativeTitles && this.data.alternativeTitles.contentPackageTitle) {
			return this.data.flags.headlineTesting;
		}
		return null;
	}

	get isPlayableVideo () {
		const isTopStory = this.data.template === 'top-story-heavy';
		const isBigStory = modsDoesInclude('big-story', this.data.mods);
		const isHeavy = this.data.template === 'heavy';
		const isLarge = modsDoesInclude('large', this.data.mods) || modsDoesInclude('hero', this.data.mods);

		return Boolean(
			this.data.flags
			&& this.data.flags.insituVideoTeaser
			&& this.data.type === 'Video'
			&& ((isTopStory && !isBigStory) || (isHeavy && isLarge))
		);
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
		return status;
	}

	// returns publishedDate, status, classModifier
	liveBlog () {
		return {
			publishedDate: this.data.updates && this.data.updates[0].date,
			status: LIVEBLOG_MAPPING[this.data.status.toLowerCase()].timestampStatus,
			classModifier: this.data.status.toLowerCase()
		};
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
