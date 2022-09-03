const { compile } = require('nexe')

compile({
	input: './dist/app.js',
	output: './build/app.exe',
	build: true, //required to use patches
	mangle: true,
	// resources: [
	// 	'./dist/config.json'
	// ],
}).then((val) => {
	console.log('success')
})