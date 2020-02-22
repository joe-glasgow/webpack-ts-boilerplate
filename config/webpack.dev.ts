const webpackDev = {
    mode: 'development',
    devtool: 'eval-source-map',
    bail: false,
    devServer: {
        publicPath: 'http://localhost',
        port: 8080,
    },
};

export default webpackDev;
