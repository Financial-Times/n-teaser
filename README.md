# n-teaser

Server and client-side teaser templates, along with their respective [next-api](https://github.com/Financial-Times/next-api) query fragments and presenters. Styling for teasers is in [o-teaser](https://github.com/Financial-Times/o-teaser).

## What is a teaser?

A teaser represents content – usually an article. It helps readers to decide if the content is relevant to them and showcases the breadth of FT content. It always links to a content page. Read the [o-teaser docs](http://registry.origami.ft.com/components/o-teaser) for more information.

## How to use

### Demo

Install dependencies with `npm install` and `bower install`

Run `make demo` to serve a set of demo templates on http://localhost:5005/{teaser-type} (all available endpoints [here](demos/app.js)).

### Use in an app

In the consuming app:

- Add to package.json
>> It’s a node module only - no need to add to bower.json

- Register the presenter in the express options
```
	helpers:  { nTeaserPresenter: require('@financial-times/n-teaser').presenter }
```
- Get the data from `next-api`

>> Use the data fragments from nTeaser that correspond to the teaser type(s) you will be using.
- Add the teaser partials to your templates

>> Should be referenced as `> n-teaser/templates/standard`

## Teaser Types

| *Teaser* | *Tag* | *Title* | *Standfirst* | *Time Stamp* | *Headshot* | *Image* | *Actions* | *Related Content* | *Duration* (video content only) |
|---|---|---|---|---|---|---|---|---|---|
| Extra Light | only if opinion or brand | Y | N | Y | N | N | N | N | N |
| Light | Y | Y | N | Y | Y | N | Y | N | Y |
| Lifestyle(1) | Y | Y | N | Y | Y | Y | N | N | Y |
| Standard | Y | Y | Y | Y | Y | N | Y | N | Y |
| Heavy | Y | Y | Y | Y | N | Y | Y | N | Y |
| TopStory | Y | Y | Y | Y | N | Heavy variant | Y | Y | Y |

(1) Lifestyle branches off the hierarchy from Light

## Data Queries
It is recommended that the data to populate n-teasers is sourced from `next-api`.
The required data properties for each of the teasers is contained in n-teaser.

Data fragments build cumulatively based on the hierarchy of teasers.
So to get all the data for a heavy teaser, you will need to use the fragments for ExtraLight, Light and Standard as well as Heavy.

Example of a `next-api` query to populate Heavy Teasers;

```
const teaserFragments = require('@financial-times/n-teaser').fragments;

module.exports = `

	${teaserFragments.teaserExtraLight}
	${teaserFragments.teaserLight}
	${teaserFragments.teaserStandard}
	${teaserFragments.teaserHeavy}

	query RelatedContent (
		$tagId: String!,
		$limit: Int!
	) {
		search(termName: "metadata.idV1", termValue: $tagId, limit: $limit) {
			...TeaserExtraLight
			...TeaserLight
			...TeaserStandard
			...TeaserHeavy
		}
	}
`;
```

## Including templates
Teasers are added to your template as partials.
Additional arguments can be passed to control display.

Example of a teaser without an image;
```
<div data-o-grid-colspan="12 L6">
	{{#slice items offset=1 limit=3}}
		{{>n-teaser/templates/standard mods=(array 'small')}}
	{{/slice}}
</div>
```
The `mods` argument is for class modifiers that are added to the base `o-teaser` class name.
Details on these can be found in the `o-teaser` repository.

Example of a teaser with an image;
```
<div data-o-grid-colspan="12 L6">
	{{#slice items offset=0 limit=1}}
		{{>n-teaser/templates/heavy mods=(array 'large') colspan='{"default": 12, "L": 6}' position='{"default": "bottom"}' widths="[500, 332]"}}
	{{/slice}}
</div>
```
The `colspan`, `position` and `widths` arguments are passed on to `n-image` to determine the properties of how the image is displayed in the teaser.
More details on what is supported by `n-image` can be found in that repository.

### Display options
Parameters can be passed to suppress some elements of teasers that would otherwise appear.

#### Elements that rely on presenter logic
- Related Content (on TopStory teasers) - set `noRelatedContent = true`
- Tag (on all teasers) - set `noTag = true`
- Author Headshot (on Light, Standard and Lifestyle teasers) - set `noHeadshot = true`
#### Elements that are not transformed by presenter logic
- Standfirst - set `standfirst = false`
- Main Image - set `mainImage = false`

## Demo page
`$ make demo`: Serves examples of the component locally (`http://localhost:5005`), using dummy data and in isolation from an app.

This is done on a simple express app which renders a single demo page that calls the partials to exhibit, populating them with data from a fixture.

## Pa11y
`$ make a11y`: Serves page of demo components, on which it runs [Pa11y](http://pa11y.org/) accessibility tests (errors flagging up accessibility infringements), which will also be run as part of the Continuous Integration (CI) process.
