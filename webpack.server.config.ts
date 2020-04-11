// eslint-disable-next-line no-unused-vars
import * as webpack from 'webpack';
import clientConfig from './webpack.config';

interface CreateWebpackConfig {
    (dev?: boolean): webpack.Configuration[];
}

const createConfig: any = (dev: boolean) => {
    const isDev = dev || process.env.NODE_ENV === 'development';
    return [
        clientConfig(isDev),
    ];
};

export default createConfig;
