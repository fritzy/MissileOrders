const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  performance: { hints: false },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'out.js'
  },
  plugins: [
  ]
};
