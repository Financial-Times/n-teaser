module.exports = {
	liveBlog: `
		fragment LiveBlogInfo on LiveBlog {
			status
			updates(limit: 1) {
				date
				text
			}
		}
	`,
	teaserExtraLight: `
		fragment TeaserExtraLight on Content {
			type: __typename
			isPremium
			relativeUrl
			title
			promotionalTitle
			publishedDate
			initialPublishedDate
			isEditorsChoice
			genreTag(only: ["MQ==-R2VucmVz", "Mw==-R2VucmVz", "OQ==-R2VucmVz", "NA==-R2VucmVz", "MTA=-R2VucmVz"]) {
				prefLabel
			}
			primaryBrandTag {
				prefLabel
				relativeUrl
				attributes(only: ["headshot"]) {
					key
					value
				}
			}
			isOpinion
		}
	`,
	teaserLight: `
		fragment TeaserLight on Content {
			id
			teaserTag {
				prefLabel
				relativeUrl
			}
		}
	`,
	teaserStandard: `
		fragment TeaserStandard on Content {
			standfirst
		}
	`,
	teaserHeavy: `
		fragment TeaserHeavy on Content {
			mainImage {
				title
				description
				url
				width
				height
				ratio
			}
		}
	`,
	teaserTopStory: `
		fragment TeaserTopStory on Content {
			storyPackage(limit: 3) {
				type: __typename
				relativeUrl
				isPremium
				title
				promotionalTitle
			}
			primaryTag {
				latestContent(limit: 4) {
					type: __typename
					relativeUrl
					isPremium
					title
					promotionalTitle
					id
				}
			}
		}
	`
};
