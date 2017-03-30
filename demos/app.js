'use strict';

const express = require('@financial-times/n-express');
const path = require('path');
const fixtures = require('./fixtures/fixtures.json');
const fixturesCommercial = require('./fixtures/fixtures-commercial-content');
const fixturesPackage = require('./fixtures/fixtures-package');
const fixturesPackageArticle = require('./fixtures/fixtures-article-in-package');
const chalk = require('chalk');
const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;

const app = module.exports = express({
	name: 'public',
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	layoutsDir: path.join(process.cwd(), '/bower_components/n-ui/layout'),
	viewsDirectory: '/demos/templates',
	partialsDirectory: process.cwd(),
	directory: process.cwd(),
	helpers:  {
		nTeaserPresenter: require('../').presenter,
		packageTeaserPresenter: require('../').presenter
	}
});

app.get('/package-article', (req, res) => {
	res.render('demo-package-article', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixturesPackageArticle));
});

app.get('/package', (req, res) => {
	res.render('demo-package', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixturesPackage));
});

app.get('/commercial', (req, res) => {
	res.render('demo-commercial-content', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixturesCommercial));
});

app.get('/', (req, res) => {
	res.render('templates/demo', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixtures));
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
