import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import express from 'express';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from '../components/App';
import Html from './html';

const helmetContext = {};

const serverRenderer: any = () => (
    req: express.Request,
    res: express.Response,
) => {
    const content = renderToString(
        <HelmetProvider context={helmetContext}>
            <App />
        </HelmetProvider>,
    );

    const state = '';
    return res.send(
        `<!doctype html>
        ${renderToString(
        <Html
            css={[res.locals.assetPath('bundle.css'), res.locals.assetPath('vendor.css')]}
            helmetContext={helmetContext}
            scripts={[res.locals.assetPath('bundle.js'), res.locals.assetPath('vendor.js')]}
            state={state}
        >
            {content}
        </Html>,
    )}`,
    );
};

export default serverRenderer;
