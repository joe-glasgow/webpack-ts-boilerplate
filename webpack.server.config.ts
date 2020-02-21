// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import webpackServer from './config/webpack.server';

type WebpackEnv = {
    mode?: webpack.Configuration['mode'];
};

interface CreateWebpackConfig {
    (args: WebpackEnv): webpack.Configuration;
}

const createConfig: Partial<CreateWebpackConfig> = ({ mode = 'production' }: WebpackEnv = {}) => {
    const isDev = mode === 'development';
    return webpackServer(isDev);
};

export default createConfig;
