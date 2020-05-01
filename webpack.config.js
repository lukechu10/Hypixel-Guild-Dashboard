const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/client/app.ts",
    devtool: argv.mode === "development" ? "inline-source-map" : "none",
    output: {
        path: path.resolve(__dirname, "dist", "webpack"),
        filename: "[name].bundle.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/client/index.html"),
            inject: "head"
        }),
        // remove moment js locales
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
});