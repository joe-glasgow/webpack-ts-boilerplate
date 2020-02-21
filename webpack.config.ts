// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import merge from 'webpack-merge';
import webpackDev from './config/webpack.dev';
import webpackProd from './config/webpack.prod';
import webpackCommon from './config/webpack.common';

type WebpackEnv = {
    mode?: webpack.Configuration['mode'];
};

interface CreateWebpackConfig {
    (args: WebpackEnv): webpack.Configuration;
}

const createConfig: CreateWebpackConfig = ({ mode = 'production' }: WebpackEnv = {}) => {
    const isDev = mode === 'development';
    // eslint-disable-next-line no-multi-assign
    process.env.BROWSERSLIST_ENV = process.env.BABEL_ENV = isDev
        ? 'development'
        : 'production';
    return merge(
        webpackCommon(isDev),
        isDev ? webpackDev : webpackProd,
    );
};

export default createConfig;
