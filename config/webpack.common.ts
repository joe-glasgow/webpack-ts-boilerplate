import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import TreatPlugin from 'treat/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

const webpackCommon = (isDev: boolean) => ({
    name: 'client',
    target: 'web',
    entry: {
        bundle: [
            path.resolve(fs.realpathSync(process.cwd()), 'src/client'),
        ],
    },
    output: {
        path: path.resolve('dist/client'),
        publicPath: path.resolve('/static/'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: cssModuleRegex,
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    onlyLocals: true,
                                    localsConvention: 'camelCase',
                                    importLoaders: 1,
                                    modules: {
                                        getLocalIdent: getCSSModuleLocalIdent,
                                    },
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    sourceMap: process.env.NODE_ENV === 'development',
                                },
                            },
                        ],
                    },
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
                    },
                    {
                        exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
                        use: [
                            {
                                loader: require.resolve('file-loader'),
                                options: {
                                    name: 'assets/[name].[hash:8].[ext]',
                                    emitFile: false,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(js|jsx|ts|tsx|mjs)$/,
                        exclude: /node_modules/,
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
                            cacheCompression: process.env.NODE_ENV === 'production',
                            compact: process.env.NODE_ENV === 'production',
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
    resolve: {
        extensions: ['.tsx', '.ts', '.wasm', '.mjs', '.js', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    optimization: {
        namedModules: true,
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            __SERVER__: 'false',
            __BROWSER__: 'true',
        }),
        new MiniCssExtractPlugin({
            filename:
                isDev ? '[name].css' : '[name].[contenthash].css',
            chunkFilename:
                isDev ? '[id].css' : '[id].[contenthash].css',
        }),
        new TreatPlugin({
            outputLoaders: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader],
        }),
    ],
});
export default webpackCommon;
