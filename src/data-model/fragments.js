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
			publishedDate
			firstPublishedDate
			isEditorsChoice
			canBeSyndicated
			genreConcept(only: ["61d707b5-6fab-3541-b017-49b72de80772", "9c2af23a-ee61-303f-97e8-2026fb031bd5", "dc9332a7-453d-3b80-a53d-5a19579d9359", "b3ecdf0e-68bb-3303-8773-ec9c05e80234", "3094f0a9-1e1c-3ec3-b7e3-4d4885a826ed"]) {
				prefLabel
			}
			displayConcept {
				prefLabel
				relativeUrl
				type
				directType
				attributes(only: ["headshot"]) {
					key
					value
				}
				id
			}
			authorConcepts(limit: 1) {
				prefLabel
				relativeUrl
				attributes(only: ["headshot"]) {
					key
					value
				}
				id
			}
			isOpinion
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
				displayConcept {
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
			storyPackage(limit: 3) {
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
	`
};
