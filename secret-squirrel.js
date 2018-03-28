module.exports = {
	files: {
		allow: [],
		allowOverrides: []
	},
	strings: {
		deny: [],
		denyOverrides: [
			'57371736-4b69-11e6-88c5-db83e98a590a', // demos/fixtures/fixtures-article-in-package.json:8, demos/fixtures/fixtures-live-rolling-splash.json:8|47|50, secrets.js:24
			'a60ae24b-b87f-439c-bf1b-6e54946b4cf2', // demos/fixtures/fixtures-article-in-package.json:29, demos/fixtures/fixtures-commercial-content.json:15|33, demos/fixtures/fixtures-live-rolling-splash.json:29, demos/fixtures/fixtures-package.json:32, demos/fixtures/fixtures.json:30, secrets.js:36
			'8b4d2118-0e51-11e7-a88c-50ba212dce4d', // demos/fixtures/fixtures-article-in-package.json:37, demos/fixtures/fixtures-live-rolling-splash.json:37, secrets.js:30
			'a3d0eff4-c224-11e6-81c2-f57d90f6741a', // demos/fixtures/fixtures-commercial-content.json:8|26, demos/fixtures/fixtures-package.json:8|77|81, demos/fixtures/fixtures.json:8|42|46, secrets.js:35
			'b135ff23-b289-3471-9162-71f0a147e7f2', // demos/fixtures/fixtures-live-rolling-splash.json:54, demos/fixtures/fixtures-video.json:9|11, secrets.js:39
			'e26d3c84-8bad-11e6-8cb7-e7ada1d123b1', // demos/fixtures/fixtures-package.json:42|43, secrets.js:50
			'e9c1897c-8bad-11e6-8cb7-e7ada1d123b1', // demos/fixtures/fixtures-package.json:46|47, secrets.js:53
			'ffa10ed8-8bea-11e6-8cb7-e7ada1d123b1', // demos/fixtures/fixtures-package.json:50|51, secrets.js:58
			'6c126eae-b81e-11e6-ba85-95d1533d9a62', // demos/fixtures/fixtures-package.json:54|55, secrets.js:27
			'c2736eba-b81e-11e6-ba85-95d1533d9a62', // demos/fixtures/fixtures-package.json:58|59, secrets.js:44
			'0ddeb68e-b81f-11e6-ba85-95d1533d9a62', // demos/fixtures/fixtures-package.json:62|63, secrets.js:16
			'536e6672-b81f-11e6-ba85-95d1533d9a62', // demos/fixtures/fixtures-package.json:66|67, secrets.js:23
			'a9c4758e-b81f-11e6-ba85-95d1533d9a62', // demos/fixtures/fixtures-package.json:70|71, secrets.js:37
			'00adf2a4-b5ae-11e6-961e-a1acd97f622d', // demos/fixtures/fixtures-package.json:84|88, demos/fixtures/fixtures.json:49|53, secrets.js:14
			'acac3a5e-b255-11e6-a37c-f4a01f1b0fa1', // demos/fixtures/fixtures-package.json:91|95, demos/fixtures/fixtures.json:56|60, secrets.js:38
			'9942f06c-80ae-11e6-bc52-0c7211ef3198', // demos/fixtures/fixtures-package.json:98|102, demos/fixtures/fixtures.json:63|67, secrets.js:32
			'fe4dc102-b6a8-4ef6-8fcd-366caba94ca6', // demos/fixtures/fixtures-video.json:38
			'e52ec40c-42d0-382f-babf-0313412b4dfd', // demos/fixtures/fixures-live-blog-closed.json:7|17, demos/fixtures/fixures-live-blog.json:7|17, secrets.js:3
			'9b40e89c-e87b-3d4f-b72c-2cf7511d2146', // demos/fixtures/fixures-live-blog-closed.json:27, demos/fixtures/fixures-live-blog.json:27, secrets.js:6
			'806d05b8-3d29-4e81-8668-e9cdae0ab086', // demos/fixtures/fixures-live-blog-closed.json:34|40, demos/fixtures/fixures-live-blog.json:34|40, secrets.js:5
			'cfe1c2b3-4ebc-3e0a-81bc-5a3eb7323b4e', // demos/fixtures/fixures-live-blog-closed.json:46, demos/fixtures/fixures-live-blog.json:46, secrets.js:7
			'c243c590-dfdc-38d9-8115-be850a588efe', // demos/fixtures/fixures-live-blog-closed.json:51|52, demos/fixtures/fixures-live-blog.json:51|52, secrets.js:13
			'68bd1f0d-70b0-3576-bfe0-d1e27583ef48', // demos/fixtures/fixures-live-blog-closed.json:58, demos/fixtures/fixures-live-blog.json:58, secrets.js:8
			'3e8526ea-779d-11e7-90c0-90a9d1bc9691', // demos/fixtures/fixures-live-blog-closed.json:68|72, demos/fixtures/fixures-live-blog.json:68|72, secrets.js:9
			'ee2cdd29-39c7-3ba2-a5b6-832ec795980b', // demos/fixtures/fixures-live-blog-closed.json:76|80, demos/fixtures/fixures-live-blog.json:76|80, secrets.js:10
			'f8447d9c-6fed-39f2-801f-06d76d4eb8d9', // demos/fixtures/fixures-live-blog-closed.json:84|88, demos/fixtures/fixures-live-blog.json:84|88, secrets.js:11
			'8a10d200-632d-11e7-8814-0ac7eb84e5f1', // demos/fixtures/fixures-live-blog-closed.json:92|96, demos/fixtures/fixures-live-blog.json:92|96, secrets.js:4
			'8a44c1da-93bd-11e7-a9e6-11d2f0ebb7f0', // demos/fixtures/fixures-live-blog-closed.json:112, demos/fixtures/fixures-live-blog.json:112, secrets.js:12
			'0b1809e6-9d30-11e6-8324-be63473ce146', // secrets.js:15, tests/fixtures/article-brand-fixture.json:52|55
			'13a73d6e-1951-11e7-a53d-df09f373be87', // secrets.js:17, tests/fixtures/package-fixture.json:32
			'19a3c8e8-9ebf-11e6-891e-abe238dee8e2', // secrets.js:18, tests/fixtures/article-brand-fixture.json:45|48
			'215e5080-9f50-11e6-86d5-4e36b35c3550', // secrets.js:19, tests/fixtures/article-brand-fixture.json:31|34
			'3094f0a9-1e1c-3ec3-b7e3-4d4885a826ed', // secrets.js:20, src/presenters/teaser-presenter.js:56
			'39da343a-9f4b-11e6-891e-abe238dee8e2', // secrets.js:21, tests/fixtures/article-opinion-author-fixture.json:4|8|34|37
			'3a34141d-e886-3c6f-8985-551ed91e994a', // secrets.js:22, tests/fixtures/article-package-fixture.json:22|25
			'61d707b5-6fab-3541-b017-49b72de80772', // secrets.js:25, src/presenters/teaser-presenter.js:52, tests/presenters/teaser-presenter.spec.js:262
			'6ae56540-0f62-11e7-b030-768954394623', // secrets.js:26, tests/fixtures/package-fixture.json:40
			'74c26d3a-9f67-11e6-891e-abe238dee8e2', // secrets.js:28, tests/fixtures/article-brand-fixture.json:19
			'7c24c36f-00e7-3b0b-8620-f91a3bd3b174', // secrets.js:29, tests/fixtures/video-es-fixture.json:3|6, tests/fixtures/video-fixture.json:3|6
			'8ecc36d0-9f66-11e6-86d5-4e36b35c3550', // secrets.js:31, tests/fixtures/article-standard-fixture.json:23|46|49
			'9c2af23a-ee61-303f-97e8-2026fb031bd5', // secrets.js:33, src/presenters/teaser-presenter.js:53
			'a2e41aa4-146c-11e7-80f4-13e067d5072c', // secrets.js:34, tests/fixtures/article-package-fixture.json:16, tests/fixtures/package-fixture.json:4|10
			'b3ecdf0e-68bb-3303-8773-ec9c05e80234', // secrets.js:40, src/presenters/teaser-presenter.js:55
			'b8bbadf6-9014-11e6-8df8-d3778b55a923', // secrets.js:41, tests/fixtures/article-opinion-author-fixture.json:55|58
			'bbcddb7a-9f61-11e6-86d5-4e36b35c3550', // secrets.js:42, tests/fixtures/article-standard-fixture.json:4|8|67|70
			'c24d6335-076a-366a-98e2-500bb26401d6', // secrets.js:43, tests/fixtures/video-es-fixture.json:15, tests/fixtures/video-fixture.json:15
			'c60276ac-9f73-11e6-891e-abe238dee8e2', // secrets.js:45, tests/fixtures/article-standard-fixture.json:15
			'cbfef2b0-9b04-11e6-b8c6-568a43813464', // secrets.js:46, tests/fixtures/article-opinion-author-fixture.json:41|44
			'ceb330c2-9f80-11e6-891e-abe238dee8e2', // secrets.js:47, tests/fixtures/article-opinion-author-fixture.json:22
			'dc9332a7-453d-3b80-a53d-5a19579d9359', // secrets.js:48, src/presenters/teaser-presenter.js:54
			'dd9a528e-1abc-11e7-bcac-6d03d067f81f', // secrets.js:49, tests/fixtures/article-package-fixture.json:3|5, tests/fixtures/package-fixture.json:36
			'e65632ec-2936-333d-a4dd-cf1005ce125c', // secrets.js:51, tests/fixtures/article-standard-fixture.json:63
			'e7db344c-9aca-11e6-b8c6-568a43813464', // secrets.js:52, tests/fixtures/article-opinion-author-fixture.json:48|51
			'f1e5e27c-9f5a-11e6-86d5-4e36b35c3550', // secrets.js:54, tests/fixtures/article-standard-fixture.json:29|53|56
			'f38eb0c6-0329-11e7-aa5b-6bb07f5c8e12', // secrets.js:55, tests/fixtures/package-fixture.json:28
			'f61b93c8-9f5a-11e6-891e-abe238dee8e2', // secrets.js:56, tests/fixtures/article-brand-fixture.json:4|8|38|41
			'fb491676-5024-3111-a959-1fbce2fbecc1', // secrets.js:57, tests/fixtures/article-package-fixture.json:28|31
			'6da31a37-691f-4908-896f-2829ebe2309e', // secrets.js:60, src/presenters/teaser-presenter.js:65
			'b2fa15d1-56b4-3767-8bcd-595b23a5ff22' // secrets.js:61, src/presenters/teaser-presenter.js:57
		]
	}
};
