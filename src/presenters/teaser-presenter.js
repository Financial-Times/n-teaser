'use strict';

const dateFnsformat = require('date-fns/format');
const hyphenatePascalCase = require('../utils/hyphenate-pascal-case');
const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_WIDTH = 75;
const HEADSHOT_DEFAULT_TINT = '054593,d6d5d3';
const TEMPLATES_WITH_HEADSHOTS = ['light', 'standard', 'lifestyle'];
const TEMPLATES_WITH_IMAGES = ['heavy', 'top-story-heavy','lifestyle'];
const PLAYABLE_VIDEO_INVALID_MODS = ['centre', 'has-image'];
const LIVEBLOG_MAPPING = {
	inprogress: {
		timestampStatus: 'live',
		labelModifier: 'live'
	},
	comingsoon: {
		timestampStatus: 'coming soon',
		labelModifier: 'pending'
	},
	closed: {
		timestampStatus: '',
		labelModifier: 'closed'
	}
};

const getHeadshotUrlParameters = (width, tint) => {
	return `?source=next&width=${width * 2}&fit=scale-down&compression=best&tint=${tint}`;
};

const isLive = (data) => {
	const isLiveBlogInProgress = (item) => item.status && item.status.toLowerCase() === 'inprogress';
	const packageHasLiveBlog = data.containedIn && data.containedIn.length && data.containedIn[0].contains && data.containedIn[0].contains.find(isLiveBlogInProgress);
	const isFirstArticleInLivePackage = packageHasLiveBlog && data.id === data.containedIn[0].contains[0].id;
	return isLiveBlogInProgress(data) || isFirstArticleInLivePackage;
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
			'61d707b5-6fab-3541-b017-49b72de80772', // Analysis
			'9c2af23a-ee61-303f-97e8-2026fb031bd5', // Interview
			'dc9332a7-453d-3b80-a53d-5a19579d9359', // Q&A
			'b3ecdf0e-68bb-3303-8773-ec9c05e80234', // Review
			'3094f0a9-1e1c-3ec3-b7e3-4d4885a826ed', // Special Report
			'b2fa15d1-56b4-3767-8bcd-595b23a5ff22' // Explainer
		];
		const disallowedBrands = [
			// HACK: temporary measure until UPP provides a way to model evolving
			// stories that start life as FastFT articles.
			'5c7592a8-1f0c-11e4-b0cb-b2227cce2b54' // FastFT
		];
		const genreConcept = this.data.genre || this.data.genreConcept;
		this.genreConcept = (genreConcept && allowedGenres.includes(genreConcept.id)) ? genreConcept : undefined;
		const authors = (this.data.authors || this.data.authorConcepts || []);
		this.authorConcept = authors.length === 1 && authors[0];
		this.brandConcept = this.data.brandConcept && disallowedBrands.includes(this.data.brandConcept.id) ? undefined : this.data.brandConcept;
	}

	get isOpinion () {
		return this.data.isOpinion || (this.data.genreConcept && this.data.genreConcept.id === '6da31a37-691f-4908-896f-2829ebe2309e');
	}

	get isVideo () {
		return this.data.type && this.data.type.toLowerCase() === 'video';
	}

	get brandAuthorDouble () {
		if (
			this.authorConcept &&
			this.isOpinion === true
		) {
			return true;
		}
			return false;
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
		if ((this.displayImage) && TEMPLATES_WITH_IMAGES.includes(this.data.template)) {
			mods.push('has-image');
		}

		if (this.isOpinion && modsDoesNotInclude('hero-image', this.data.mods)) {
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

		if (
			this.data.type === 'LiveBlog' &&
			this.data.status &&
			this.data.status.toLowerCase() === 'inprogress'
		) {
			mods.push('live');
		}

		if (isLive(this.data)) {
			mods.push('live');
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

		if(this.data.type === 'special-report') {
			return this.data.teaserConcept;
		}

		if (packageArticle && packageArticle[0] && packageArticle[0].title) {
			return Object.assign(this, { prefLabel: packageArticle[0].title, relativeUrl: packageArticle[0].relativeUrl});
		} else {
			// Use Display concept if Brand concept is the same as stream
			if (this.data.streamProperties &&
				this.data.streamProperties.id &&
				this.brandConcept &&
				this.data.streamProperties.id === this.brandConcept.id) {
				return displayConcept || null;
			}
			// Use Author Concept if Opinion & Branded unless same as stream
			if (this.authorConcept &&
					this.brandAuthorDouble &&
				(!this.data.streamProperties ||
				(this.data.streamProperties &&
				this.data.streamProperties.id !== this.authorConcept.id ))) {
				return this.authorConcept;
			}
			return this.brandConcept || displayConcept || null;
		}
	}

	//returns genre prefix
	get genrePrefix () {
		//use package brand if article belongs to package
		let packageArticle = this.data.containedIn;

		// Editorial Special Report or FT Series
		if (packageArticle && packageArticle[0] && packageArticle[0].title && packageArticle[0].brand) {
			return packageArticle[0].brand.prefLabel;
		}

		// special-report coming from DFP ads
		if(this.data.type === 'special-report') {
			return 'Special Report';
		}

		if (this.data.type && this.data.type.toLowerCase() === 'video') {
			return 'Video';
		}

		if (this.brandAuthorDouble) {
			// dedupe authors who are also brands and where Author = stream
			if (this.brandConcept &&
				this.brandConcept.prefLabel !== this.authorConcept.prefLabel &&
				(!this.data.streamProperties ||
				(this.data.streamProperties &&
				this.data.streamProperties.id !== this.authorConcept.id))) {
				return this.brandConcept.prefLabel;
			}
		}

		// Do not show a genre prefix against brands
		if (!this.genreConcept || this.brandConcept === this.teaserConcept) {
			return null;
		}

		// Do not show a prefix if the stream is a special report
		if (this.genreConcept && this.genreConcept.prefLabel === 'Special Report' &&
			this.data.streamProperties &&
			this.data.streamProperties.directType === 'http://www.ft.com/ontology/SpecialReport') {
			return null;
		}

		return this.genreConcept.prefLabel;
	}

	//returns publishedDate, status, classModifier
	get timeObject () {
		if (this.data.status) {
			return this.liveBlog();
		} else {
			return {
				publishedDate: this.data.publishedDate,
				status: this.timeStatus(),
				skipPerfAbTesting: !this.data.flags || !(this.data.flags.perfDate2 || this.data.flags.perfJanky),
				isNewerThanFourHours: this.isNewerThanFourHours(),
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

		if (this.brandAuthorDouble
			&& this.authorConcept
			&& this.authorConcept.headshot
		) {
			headshotName = this.authorConcept.headshot.name;
		}

		if (headshotName) {
			const headShotTint = this.data.headshotTint || HEADSHOT_DEFAULT_TINT;
			const headshotUrlParameters = getHeadshotUrlParameters(HEADSHOT_WIDTH, headShotTint);
			return {
				url: `${HEADSHOT_BASE_URL}fthead:${headshotName}${headshotUrlParameters}`,
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
		const altTitles = this.data.alternativeTitles;
		if (this.data.flags && this.data.flags.headlineTesting && this.data.flags.headlineTesting === 'variant2' && altTitles && (altTitles.promotionalTitleVariant || altTitles.contentPackageTitle)) {
			return altTitles.promotionalTitleVariant ? altTitles.promotionalTitleVariant : altTitles.contentPackageTitle;
		} else if (this.data.flags && this.data.flags.teaserUsePromotionalTitle) {
			if (this.data.promotionalTitle) {
				return this.data.promotionalTitle;
			}
			if (this.data.alternativeTitles && this.data.alternativeTitles.promotionalTitle) {
				return this.data.alternativeTitles.promotionalTitle;
			}
		}
		return this.data.title;
	}

	get displayStandfirst () {
		//Note: although everywhere else we prefer the promotional version for teasers, we can't do that for standfirsts because the promotionalStandfirst is used for the App Skyline.
		//So we will only use the promotionalStandfirst if there is no standfirst
		return this.data.standfirst || this.data.promotionalStandfirst;
	}

	get displayImage () {
		return this.data.promotionalImage || this.data.mainImage;
	}

	// returns the variant name if headline testing is live for this story
	get headlineTestingVariant () {
		const altTitles = this.data.alternativeTitles;
		if (this.data.flags && this.data.flags.headlineTesting && altTitles && (altTitles.promotionalTitleVariant || altTitles.contentPackageTitle)) {
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
			!!this.data.enablePlayableVideo
			&& this.data.flags
			&& this.data.flags.insituVideoTeaser
			&& (this.data.type && this.data.type.toLowerCase() === 'video')
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

	isNewerThanFourHours () {
		const now = Date.now();
		const publishedDate = new Date(this.data.publishedDate).getTime();
		return (now - publishedDate < 4 * 60 * 60 * 1000);
	}

	// returns publishedDate, status, classModifier
	liveBlog () {
		return {
			publishedDate: this.data.updates && Array.isArray(this.data.updates) && this.data.updates[0] && this.data.updates[0].date,
			status: LIVEBLOG_MAPPING[this.data.status.toLowerCase()].timestampStatus,
			classModifier: this.data.status.toLowerCase()
		};
	}

	get duration () {

		let date = undefined;
		let duration = undefined;
		let formattedDuration = undefined;

		if (this.data.duration && this.data.formattedDuration) {
			//this route is for video data from next-api
			date = new Date(this.data.duration);
			duration = this.data.duration;
			formattedDuration = this.data.formattedDuration;
		} else if (this.data.attachments) {
			//this route is for video data from next-es-interface
			//these code come from next-api/server/v2/graphql/types/content/video.js to set duration
			duration = this.data.attachments.filter(({ mediaType }) => mediaType === 'video/mp4')
				.slice(0, 1)
				.map(({ duration }) => duration)
				.shift();
			date = new Date(duration);
			formattedDuration = duration ? dateFnsformat(duration,'m:ss') : undefined;
		}

		const durationData = {
			// https://en.wikipedia.org/wiki/ISO_8601#Durations
			iso: date ? `PT${date.getMinutes()}M${date.getSeconds()}S` : undefined,
			ms: duration,
			formatted: formattedDuration
		};

		return formattedDuration ? durationData : null;
	}

	get visited () {
		if (this.data.flags && this.data.flags.visitedStoriesOnTeaser) {
			return true;
		}
	}

};

module.exports = TeaserPresenter;
