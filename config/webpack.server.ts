import path from 'path';
import nodeExternals from 'webpack-node-externals';

const webpackServer = (isDev: boolean) => ({
    mode: isDev ? 'development' : 'production',
    target: 'node',
    entry: {
        server: './src/server.ts',
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
                    plugins: ['babel-plugin-treat'],
                    cacheDirectory: true,
                },
            },
        ],
    },
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, '../dist'),
    },
});

export default webpackServer;
