const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_URL_PARAMS = '?source=next&fit=scale-down&compression=best&width=75&tint=054593,fff1e0';
const TEMPLATES_WITH_HEADSHOTS = ['light','standard'];
const TEMPLATES_WITH_IMAGES = ['heavy'];
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
	classModifiers () {
		const mods = this.data.mods || [];
		if (
			this.headshot() &&
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
		return mods;
	}

	//returns tag to be displayed
	displayTag () {
		return this.data.primaryBrandTag || this.data.teaserTag || null;
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
		if (this.data.liveBlog && this.data.liveBlog.status) {
			return {
				publishedDate: this.data.liveBlog.latestUpdate && this.data.liveBlog.latestUpdate.date,
				status: LIVEBLOG_MAPPING[this.data.liveBlog.status],
				originalStatus: this.data.liveBlog.status
			}
		}
	}

	// returns an array of content items related to the main article
	relatedContent () {
		if (this.data.storyPackage.length > 0) {
			return this.data.storyPackage.slice(0, MAX_RELATED_CONTENT);
		} else {
			return this.data.primaryTag.latestContent
				.filter(content => content.id !== this.data.id)
				.slice(0, MAX_RELATED_CONTENT);
		}
	}

	// returns url and name for author headshot when primary brand tag is an author with a headshot
	headshot () {
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

};

module.exports = TeaserPresenter;
