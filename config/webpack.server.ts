import path from 'path';
import nodeExternals from 'webpack-node-externals';

const webpackServer = (isDev: boolean) => {
    console.log(isDev);
    return {
        entry: {
            server: './src/server.ts',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'babel-loader',
                    ],
                },
            ],
        },
        externals: [nodeExternals()],
        output: {
            path: path.resolve(__dirname, '../dist'),
        },
    };
};

export default webpackServer;
