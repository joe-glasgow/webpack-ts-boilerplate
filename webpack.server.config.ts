// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import merge from 'webpack-merge';
import webpackServer from './config/webpack.server';

type WebpackEnv = {
    mode?: webpack.Configuration['mode'];
};

interface CreateWebpackConfig {
    (args: WebpackEnv): webpack.Configuration;
}

const createConfig: CreateWebpackConfig = ({ mode = 'production' }: WebpackEnv = {}) => {
    const isDev = mode === 'development';
    // eslint-disable-next-line no-multi-assign
    return merge(
        webpackServer(isDev),
        {
            mode,
            target: 'node',
        },
    );
};

export default createConfig;
