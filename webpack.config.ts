// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import merge from 'webpack-merge';
import webpackDev from './config/webpack.dev';
import webpackProd from './config/webpack.prod';
import webpackCommon from './config/webpack.common';

interface CreateWebpackConfig {
    (isDev?: boolean): webpack.Configuration;
}

const createConfig: CreateWebpackConfig = (dev: boolean) => {
    const isDev = dev || process.env.NODE_ENV === 'development';
    // eslint-disable-next-line no-multi-assign
    process.env.BROWSERSLIST_ENV = process.env.BABEL_ENV = (process.env.NODE_ENV || 'development');
    return merge(
        webpackCommon(isDev),
        isDev ? webpackDev : webpackProd,
    );
};

export default createConfig;
