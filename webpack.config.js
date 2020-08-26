const path = require('path');

module.exports = {
  entry: './index.js',
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'out.js'
  },
  module: {
	rules: [
	  {
		test: /\.m?js$/,
		//exclude: /(node_modules|bower_components)/,
        include: /(ape-ecs|\/src)/,
		use: {
		  loader: 'babel-loader',
		  options: {
			presets: [
              ['@babel/preset-env',
                {
                  targets: {
                    chrome: 85,
                    firefox: 82
                  }
                }]
              ],
			plugins: ["@babel/plugin-proposal-class-properties"]
		  }
		}
	  }
	]
  }
};
