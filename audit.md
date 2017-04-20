.o-teaser__tag 						// Small coloured tag at the top of the teaser
.o-teaser__duration					// Duration of the content (for video content)
.o-teaser__heading 					// Main heading of the teaser
.o-teaser__standfirst 				// A short piece of content
.o-teaser__image-container			// Wrapper element for an image
.o-teaser__image       				// An image for the teaser
.o-teaser__headshot					// Author's headshot image
.o-teaser__timestamp 				// A styled timestamp for the teaser
.o-teaser__related 				 	// A list of related content links
.o-teaser__related-item

ACTIONS:
- change title partial to heading


top-story-standard:
	default
	actions
	related

top-story-heavy:
	default
	actions
	related
	image

standard:
	default
	actions
	headshot

package-list:
	image
	default
	packageContent

light:
	default
	actions
	headshot

lifestyle:
	default
	headshot

heavy:
	default
	actions
	image

extra-light:
	default

