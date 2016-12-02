const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_URL_PARAMS = '?source=next&fit=scale-down&compression=best&width=75&tint=054593,fff1e0';
const TEMPLATES_WITH_HEADSHOTS = ['light','standard','lifestyle'];
const TEMPLATES_WITH_IMAGES = ['heavy', 'top-story-heavy','lifestyle'];
const LIVEBLOG_MAPPING = {
	inprogress: 'last post',
	comingsoon: 'coming soon',
	closed: 'liveblog closed'
};

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data || {};
	}

	// returns all top level class names appropriate for the teaser
	get classModifiers () {
		const mods = this.data.mods || [];
		if (
			this.headshot &&
			TEMPLATES_WITH_HEADSHOTS.some(template => template === this.data.template)
		) {
			mods.push('has-headshot');
		}
		if (this.data.size) mods.push(this.data.size);
		if (
			this.data.mainImage &&
			TEMPLATES_WITH_IMAGES.some(template => template === this.data.template)
		) {
			mods.push('has-image');
		}
		if (this.data.isOpinion) {
			mods.push('opinion');
		}
		if (this.data.isEditorsChoice) {
			mods.push('highlight');
		}
		return mods;
	}

	//returns tag to be displayed
	get displayTag () {
		if ((this.data.streamId && this.data.primaryBrandTag) &&
			(this.data.streamId === this.data.primaryBrandTag.idV1)) {
			return this.data.teaserTag || null;
		}
		return this.data.primaryBrandTag || this.data.teaserTag || null;
	}

	//returns genre prefix
	get genrePrefix () {
		if (!this.data.genreTag || this.data.primaryBrandTag === this.displayTag) {
			return null;
		}
		return this.data.genreTag.prefLabel;
	}

	//returns publishedDate, status, classModifier
	get timeObject () {
		if (this.data.liveBlog && this.data.liveBlog.status) {
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
		if (this.data.storyPackage.length > 0) {
			return this.data.storyPackage.slice(0, MAX_RELATED_CONTENT);
		} else {
			return this.data.primaryTag.latestContent
			.filter(content => content.id !== this.data.id)
			.slice(0, MAX_RELATED_CONTENT);
		}
	}

	// returns url and name for author headshot when primary brand tag is an author with a headshot
	get headshot () {
		if (this.data.primaryBrandTag && this.data.primaryBrandTag.attributes.length > 0) {
			const fileName = this.data.primaryBrandTag.attributes[0].value;
			return {
				src: `${HEADSHOT_BASE_URL}${fileName}${HEADSHOT_URL_PARAMS}`,
				alt: this.data.primaryBrandTag.prefLabel
			};
		} else {
			return null;
		}
	}

	// returns duration in the format m:ss
	get formattedDuration () {
		const duration = this.data.duration;
		if (duration > 0) {
			const minutes = Math.floor(duration / (1000 * 60));
			const seconds = Math.round(duration / 1000) - (minutes * 60);
			return `${minutes}.${seconds < 10 ? '0' : ''}${seconds}`;
		}
	}

	//returns prefix for timestamp (null / 'new' / 'updated')
	timeStatus () {
		const now = Date.now();
		const publishedDate = new Date(this.data.publishedDate).getTime();
		const initialPublishedDate = new Date(this.data.initialPublishedDate).getTime();
		let status = null;
		if (now - publishedDate < ONE_HOUR) {
			if (publishedDate === initialPublishedDate) {
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
			publishedDate: this.data.liveBlog.latestUpdate && this.data.liveBlog.latestUpdate.date,
			status: LIVEBLOG_MAPPING[this.data.liveBlog.status],
			classModifier: this.data.liveBlog.status
		}
	}

};

module.exports = TeaserPresenter;
