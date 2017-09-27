'use strict';

const express = require('@financial-times/n-internal-tool');
const fixtures = require('./fixtures/fixtures.json');
const fixturesCommercial = require('./fixtures/fixtures-commercial-content');
const fixturesPackage = require('./fixtures/fixtures-package');
const fixturesPackageArticle = require('./fixtures/fixtures-article-in-package');
const fixturesVideo = require('./fixtures/fixtures-video');
const fixturesLiveBlog = require('./fixtures/fixures-live-blog.json')
const fixturesLiveBlogClosed = require('./fixtures/fixures-live-blog-closed.json');
const chalk = require('chalk');
const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;

const app = module.exports = express({
	name: 'public',
	systemCode: 'n-teaser-demo',
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	layoutsDir: 'demos/templates',
	viewsDirectory: '/demos/templates',
	partialsDirectory: process.cwd(),
	directory: process.cwd(),
	demo: true,
	s3o: false,
	helpers:  {
		nTeaserPresenter: require('../').presenter,
		packageTeaserPresenter: require('../').presenter
	}
});

app.get('/package-article', (req, res) => {
	res.render('demo-package-article', Object.assign({
		title: 'Content from package teasers',
		layout: 'demo-layout',
	}, fixturesPackageArticle));
});

app.get('/package', (req, res) => {
	res.render('demo-package', Object.assign({
		title: 'Package with content teasers',
		layout: 'demo-layout',
	}, fixturesPackage));
});

app.get('/video', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Video teasers',
		layout: 'demo-layout',
	}, fixturesVideo));
});

app.get('/commercial', (req, res) => {
	res.render('demo-commercial-content', Object.assign({
		title: 'Commercial teasers',
		layout: 'demo-layout',
	}, fixturesCommercial));
});

app.get('/article', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Article teasers',
		layout: 'demo-layout',
	}, fixtures));
});

app.get('/live-blog', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Live blog teasers',
		layout: 'demo-layout',
	}, fixturesLiveBlog));
});

app.get('/live-blog-closed', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Closed live blog teasers',
		layout: 'demo-layout',
	}, fixturesLiveBlogClosed));
});

function runPa11yTests () {
	const spawn = require('child_process').spawn;
	const pa11y = spawn('pa11y-ci');

	pa11y.stdout.on('data', (data) => {
		console.log(highlight(`${data}`)); //eslint-disable-line
	});

	pa11y.stderr.on('data', (error) => {
		console.log(errorHighlight(`${error}`)); //eslint-disable-line
	});

	pa11y.on('close', (code) => {
		process.exit(code);
	});
}

const listen = app.listen(5005);

if (process.env.PA11Y === 'true') {
	listen.then(runPa11yTests);
}
