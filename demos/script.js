fetch('../templates/opinion.mustache')
	.then(res => res.text())
	.then(source => {
	const template = Handlebars.compile(source);
	const context = {
		img: {
			src: 'http://image.webservices.ft.com/v1/images/raw/fthead:mrs-moneypenny?source=origami&amp;width=60',
			alt: 'demo image'
		},
		tag: 'Mrs Moneypenny',
		heading: 'Japan sells negative yield 10-year bonds',
		datetime: {
			raw: '2016-02-29T12:35:48Z',
			formatted: '2016-02-29T12:35:48Z'
		}
	};
	document.querySelector('#opinion').innerHTML = template(context);
});