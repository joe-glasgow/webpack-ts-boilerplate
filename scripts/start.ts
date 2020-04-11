import webpack from 'webpack';
import nodemon from 'nodemon';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import createWebpackConfig from '../webpack.server.config';

const compilerPromise = (name: string, compiler: any) => new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
        console.log(`[${name}] Compiling `);
    });
    compiler.hooks.done.tap(name, (stats: any) => {
        if (!stats.hasErrors()) {
            return resolve();
        }
        return reject(Error(`Failed to compile ${name}`));
    });
});

const app = express();
const WEBPACK_PORT = process.env.WEBPACK_PORT
    // eslint-disable-next-line no-restricted-globals
    || (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 8501);
const DEVSERVER_HOST = process.env.DEVSERVER_HOST || 'http://localhost';

const start = async () => {
    const [clientConfig, serverConfig] = createWebpackConfig();
    clientConfig.entry.bundle = [
        `webpack-hot-middleware/client?path=${DEVSERVER_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
        ...clientConfig.entry.bundle,
    ];
    clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
    clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';
    const { publicPath } = clientConfig.output;
    clientConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
        .join('/')
        .replace(/([^:+])\/+/g, '$1/');
    // serverConfig.output.publicPath = [`${DEVSERVER_HOST}:${WEBPACK_PORT}`, publicPath]
    //     .join('/')
    //     .replace(/([^:+])\/+/g, '$1/');
    console.log([clientConfig, serverConfig]);
    const multiCompiler = webpack([clientConfig]);
    const clientCompiler: any = multiCompiler.compilers.find(
        (compiler) => compiler.name === 'client',
    );
    // const serverCompiler: any = multiCompiler.compilers.find(
    //     (compiler) => compiler.name === 'server',
    // );
    const clientPromise = compilerPromise('client', clientCompiler);
    // const serverPromise = compilerPromise('server', serverCompiler);
    const watchOptions = {
        ignored: /node_modules/,
        stats: clientConfig.stats,
    };
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        return next();
    });
    app.use(
        webpackDevMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            stats: clientConfig.stats,
            watchOptions,
        }),
    );
    app.use(webpackHotMiddleware(clientCompiler));
    app.use('/static', express.static('dist/client'));
    app.listen(WEBPACK_PORT);
    // serverCompiler.watch(watchOptions, (error, stats) => {
    //     if (!error && !stats.hasErrors()) {
    //         console.log(stats.toString(serverConfig.stats));
    //         return;
    //     }
    //
    //     if (error) {
    //         console.log(error, 'error');
    //     }
    //
    //     if (stats.hasErrors()) {
    //         const info = stats.toJson();
    //         const errors = info.errors[0].split('\n');
    //         console.log(errors[0], 'error');
    //         console.log(errors[1], 'error');
    //         console.log(errors[2], 'error');
    //     }
    // });

    // wait until client and server is compiled
    try {
        // await serverPromise;
        await clientPromise;
    } catch (error) {
        console.log(`Compiler: ${error}`);
    }

    // const script = nodemon({
    //     script: 'dist/server/server.js',
    //     ignore: ['src', 'scripts', 'config', './*.*', 'build/client', '**/locales', '**/tmp'],
    //     delay: 200,
    // });
    //
    // script.on('restart', () => {
    //     console.log('Server side app has been restarted.', 'warning');
    // });
    //
    // script.on('quit', () => {
    //     console.log('Process ended');
    //     process.exit();
    // });
    //
    // script.on('error', () => {
    //     console.log('An error occured. Exiting', 'error');
    //     process.exit(1);
    // });
};

start();