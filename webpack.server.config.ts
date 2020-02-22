// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import webpackServer from './config/webpack.server';

interface CreateWebpackConfig {
    (): webpack.Configuration;
}

const createConfig: Partial<CreateWebpackConfig> = () => {
    const isDev = process.env.NODE_ENV === 'development';
    return webpackServer(isDev);
};

export default createConfig;
