const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: [
        './src/index'
    ],
    output: {
        path: `${__dirname}/dist/`,
        filename: 'agnostic-orm.dev.js'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js']
    },
    devtool: '#inline-source-map',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            }
        ]
    }
};
