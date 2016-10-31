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
			publishedDate
			initialPublishedDate
		}
	`,
	teaserLight: `
		fragment TeaserLight on Content {
			id
			teaserTag {
				prefLabel
				relativeUrl
			}
			genreTag(only: ["Analysis"]) {
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
		}
	`,
	teaserStandard: `
		fragment TeaserStandard on Content {
			standfirst
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
	teaserHeavy: `
		fragment TeaserRelatedContent on Content {
			storyPackage(limit: 3) {
				type: __typename
				relativeUrl
				isPremium
				title
			}
			primaryThemeTag {
				latestContent(limit: 4) {
					type: __typename
					relativeUrl
					isPremium
					title
				}
			}
		}
	`
};
