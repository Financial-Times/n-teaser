
const TeaserPresenter = require('../presenters/teaser-presenter');
const packagePresenter = require('../presenters/package-teaser-presenter');

module.exports = (context, options) => {
	if (options.hash) Object.assign(context, options.hash);
	if (options.data) {
		let nTeaserPresenter;
		if(context.canBePackage && context.type === 'Package') {
			nTeaserPresenter = new packagePresenter(context);
		} else {
			nTeaserPresenter = new TeaserPresenter(context);
		}
		return options.fn(context, { data: { nTeaserPresenter } } );
	}
};
