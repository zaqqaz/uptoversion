const path = require('path');
const webpack = require('webpack');

module.exports = {
    target: 'node',
    entry: './src/index.ts',
    output: {
        libraryTarget: "commonjs",
        filename: 'bin.js',
        path: path.resolve(__dirname, 'bin'),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    ]
};
