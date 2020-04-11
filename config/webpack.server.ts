import path from 'path';
import nodeExternals from 'webpack-node-externals';

const webpackServer = (isDev: boolean) => ({
    name: 'server',
    mode: isDev ? 'development' : 'production',
    target: 'node',
    entry: {
        server: [
            path.resolve(__dirname, '../src/server/'),
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
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
                    cacheDirectory: true,
                    cacheCompression: process.env.NODE_ENV === 'production',
                    compact: process.env.NODE_ENV === 'production',
                },
            },
        ],
    },
    externals: [nodeExternals()],
    output: {
        path: path.resolve('dist/server'),
        filename: '[name].js',
        publicPath: path.resolve('/static/'),
    },
});

export default webpackServer;
