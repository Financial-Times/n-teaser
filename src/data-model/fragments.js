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
			id
			isPremium
			relativeUrl
			title
			promotionalTitle
			alternativeTitles {
				contentPackageTitle
			}
			publishedDate
			firstPublishedDate
			isEditorsChoice
			canBeSyndicated
			isOpinion
			genre {
				id
				prefLabel
			}
			brand {
				prefLabel
				relativeUrl
				directType
				id
			}
			brandConcept {
				prefLabel
				relativeUrl
				directType
				id
			}
			authors {
				prefLabel
				relativeUrl
				id
				headshot {
					name
				}
			}
		}
	`,
	teaserLight: `
		fragment TeaserLight on Content {
			id
			displayConcept {
				prefLabel
				relativeUrl
			}
			...on Video {
				duration
				formattedDuration(format: "m:ss")
			}
		}
	`,
	teaserLifestyle: `
		fragment TeaserLifestyle on Content {
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
	teaserStandard: `
		fragment TeaserStandard on Content {
			standfirst
		}
	`,
	teaserHeavy: `
		fragment TeaserHeavy on Content {
			containedIn(limit: 1) {
				title
				relativeUrl
				...on Package {
					design {
						theme
					}
				}
				brand {
					prefLabel
					relativeUrl
				}
			}
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
			curatedRelatedContent(limit: 3) {
				type: __typename
				relativeUrl
				isPremium
				title
				promotionalTitle
			}
			displayConcept {
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
	`,
	packageTeaser: `
		fragment PackageTeaser on Package {
			design {
				theme
			}
		}
	`,
	packageTeaserList: `
		fragment PackageTeaserList on Package {
			contains(limit: 3) {
				title
				promotionalTitle
				relativeUrl
			}
		}
	`,
	livePackageSplash: `
		fragment LivePackageSplash on Content {
			...on Package {
				contains(limit: 10) {
					id
					...on LiveBlog {
						status
					}
				}
			}
		}
	`
};
