import * as path from 'path';
import TreatPlugin from 'treat/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackCommon = (isDev: boolean) => {
    const outputFilenamePattern = isDev
        ? '[name].js'
        : '[name].[contenthash].js';
    const publicPath = '/';

    return {
        entry: path.resolve(__dirname, '../src/start.ts'),
        resolve: {
            extensions: ['.tsx', '.ts', '.wasm', '.mjs', '.js', '.json'],
            alias: {
                'react-dom': '@hot-loader/react-dom',
            },
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            include: [path.resolve(__dirname, publicPath)],
                            test: [/\.ts$/, /\.tsx$/],
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/typescript',
                                    '@babel/react',
                                    [
                                        '@babel/env',
                                        {
                                            modules: false,
                                            useBuiltIns: 'usage',
                                            corejs: 3,
                                        },
                                    ],
                                ],
                                plugins: ['babel-plugin-treat'],
                                cacheDirectory: true,
                            },
                        },
                        {
                            test: [/\.png$/, /\.jpe?g$/, /\.gif$/, /\.svg$/],
                            use: ['file-loader'],
                        },
                    ],
                },
            ],
        },
        plugins: [
            new TreatPlugin({
                outputLoaders: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[chunkhash].css',
                chunkFilename: '[name].[chunkhash].css',
            }),
            new HtmlWebpackPlugin({
                template: require.resolve('../src/index.html'),
            }),
        ],
        output: {
            filename: outputFilenamePattern,
            chunkFilename: outputFilenamePattern,
            publicPath,
        },
    };
};

export default webpackCommon;
