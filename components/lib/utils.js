module.exports = {
	hyphenatePascalCase: value => {
		return value.replace(/([a-z])([A-Z])/g, '$1-$2')
			.toLowerCase();
	},
	brandAuthorDouble: input => {
		return input.authorConcepts && input.authorConcepts.length &&	input.isOpinion === true;
	},
	isPackage: input => input.canBePackage && input.type.toLowerCase() === 'package',
	LIVEBLOG_MAPPING: {
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
	}
}
