'use strict';

const webpack = require("webpack");
const path = require('path');
const prod = process.argv.indexOf('-p') !== -1;
const js_output_template = prod ? "[name]-[hash].js" : "[name].js";
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: prod ? "assets/css/[name].[contenthash].css" : "assets/css/[name].css"
});
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',

    devtool: 'source-map',

    output: {
        filename: `js/${js_output_template}`,
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: `js/${js_output_template}.map`,
        publicPath: "/"
    },

    resolve: {
        // no need to specify extensions when importing
        extensions: ['.js', '.jsx', '.js.jsx'],

        // priority of lookup -> left to right
        modules: ["app/components", "app/services", "node_modules"]
    },

    performance: {
        // warn when bundle size is more than a megabyte
        maxEntrypointSize: 1000000,
        maxAssetSize: 1000000
    },

    module: {
        rules: [{
                test: /(\.js|\.jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["react", "es2015"],
                    babelrc: false
                }
            },
            {
                test: /(\.css|\.scss)$/,
                use: ['css-hot-loader'].concat(extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: { url: false }
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })),
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[ext]',
                },
            },

            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader',
                options: {
                    name: './images/[name].[ext]',
                },
            },

        ]
    },

    plugins: [
        // cleaning up the destination directory before writing new files
        new CleanWebpackPlugin(['dist/***/**/*.css', 'dist/**/*.js', 'dist/**/*.js.*', 'dist/*.html']),
        extractSass,
        new HtmlWebpackPlugin({
            title: '1THING',
            template: 'index.ejs'
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.(js|html|css)$/,
            minRatio: 0.8
        }),

    ],

}