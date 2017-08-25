const { brandAuthorDouble } = require('./utils');
const nImagePresenter = require('./n-image');
const HEADSHOT_WIDTH = 75;
const HEADSHOT_BASE_URL = 'https://www.ft.com/__origami/service/image/v2/images/raw/';
const HEADSHOT_URL_PARAMETERS = `?source=next&width=${HEADSHOT_WIDTH * 2}&fit=scale-down&compression=best&tint=054593,d6d5d3`;


	// returns url and name for author headshot when brand concept is an author with a headshot
module.exports = input => {
	let headshotName;
	let author;

	if ((brandAuthorDouble(input) === true)
		&& input.authorConcepts.length > 0
		&& input.authorConcepts[0].headshot
	) {
		headshotName = input.authorConcepts[0].headshot.name;
		author = input.authorConcepts[0];
	}

	if (headshotName) {
		return new nImagePresenter({
			srcSet: `${HEADSHOT_BASE_URL}fthead:${headshotName}${HEADSHOT_URL_PARAMETERS}`,
			width: HEADSHOT_WIDTH,
			height: HEADSHOT_WIDTH,
			sizes: HEADSHOT_WIDTH,
			widths: [HEADSHOT_WIDTH, 2 * HEADSHOT_WIDTH],
			alt: `Photo of ${author.prefLabel}`,
			lazyLoad: true
		});
	} else {
		return null;
	}
}
