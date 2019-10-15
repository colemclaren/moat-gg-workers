module.exports = {
	mode: 'production',
	target: 'webworker',
	node: {
		fs: "empty",
		net: "empty"
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: 'raw-loader'
			}
		]
	}
};
