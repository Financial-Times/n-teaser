
const TeaserPresenter = require('../presenters/teaser-presenter');

module.exports = (context, options) => {
	if (options.hash) Object.assign(context, options.hash);
	if (options.data) {
		const nTeaserPresenter = new TeaserPresenter(context);
		return options.fn(context, {data: { nTeaserPresenter } } );
	}
};
