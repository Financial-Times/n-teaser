'use strict';

const express = require('@financial-times/n-express');
const path = require('path');
const fixtures = require('./fixtures.json');

const app = module.exports = express({
	name: 'public',
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	layoutsDir: path.join(process.cwd(), '/bower_components/n-ui/layout'),
	viewsDirectory: '/demos',
	partialsDirectory: process.cwd(),
	directory: process.cwd(),
	helpers:  { nTeaserPresenter: require('../').presenter }
});

app.get('/', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Test App',
		layout: 'vanilla',
	}, fixtures));
});

app.listen(5005);
