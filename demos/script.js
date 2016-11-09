const data = {
	img: {
		alt: 'demo image'
	},
	tag: {
		href: '#',
		text: 'Mrs Moneypenny'
	},
	heading: {
		href: '#',
		text: 'Japan sells negative yield 10-year bonds'
	},
	datetime: {
		raw: '2016-02-29T12:35:48Z',
		formatted: '2016-02-29T12:35:48Z'
	}
};

const images = {
	landscape: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fim.ft-static.com%2Fcontent%2Fimages%2Fa60ae24b-b87f-439c-bf1b-6e54946b4cf2.img?source=o-card-demo',
	opinion: 'http://www.ft.com/__origami/service/image/v2/images/raw/fthead:mrs-moneypenny?source=origami&amp;width=60'
};

['landscape', 'opinion'].forEach(style => {
	fetch(`../templates/${style}.html`)
		.then(res => res.text())
		.then(source => {
		const template = Handlebars.compile(source);
		data.img.src = images[style];
		document.querySelector(`#${style}`).innerHTML = template(data);
	});
});
