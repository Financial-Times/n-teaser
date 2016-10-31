const ONE_HOUR = 1000 * 60 * 60;
const MAX_RELATED_CONTENT = 3;
const HEADSHOT_BASE_URL = 'https://next-geebee.ft.com/image/v1/images/raw/';

const TeaserPresenter = class TeaserPresenter {

	constructor (data) {
		this.data = data;
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

	// returns published, state, classModifier
	liveBlog () {
		if (this.data.liveBlog && this.data.liveBlog.status) {
			return {
				published: this.data.liveBlog.latestUpdate && this.data.liveBlog.latestUpdate.date,
				state: this.data.liveBlog.status.toLowerCase(),
				classModifier: this.data.liveBlog.status.replace(' ', '-')
			}
		}
	}

	// returns an array of content items related to the main article
	relatedContent () {
		if (storyPackage.length > 0) {
			return storyPackage.slice(0, MAX_RELATED_CONTENT);
		} else {
			return primaryTag.latestContent
				.filter(content => content.id !== this.data.id)
				.slice(0, MAX_RELATED_CONTENT);
		}
	}

	// returns url for author headshot when primary brand tag is an author with a headshot
	headshot () {
		if (this.data.primaryBrandTag.attributes.length > 0) {
			return `${HEADSHOT_BASE_URL}${this.data.primaryBrandTag.attributes[0].value}`;
		} else {
			return null;
		}
	}

	// returns the tag to be displayed between teaserTag & primaryBrandTag
	displayTag () {
		return primaryBrandTag ? primaryBrandTag : teaserTag;
	}

};

module.exports = TeaserPresenter;
