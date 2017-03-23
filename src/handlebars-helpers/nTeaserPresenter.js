
const TeaserPresenter = require('../presenters/teaser-presenter');
const packagePresenter = require('../presenters/package-teaser-presenter');

module.exports = (context, options) => {
	if (options.hash) Object.assign(context, options.hash);
	if (options.data) {
		const nTeaserPresenter = new TeaserPresenter(context);
		const packageTeaserPresenter = new packagePresenter(context);
		return options.fn(context, { data: { nTeaserPresenter, packageTeaserPresenter } } );
	}
};
