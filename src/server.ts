import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './components/App';
import html from './html';

const app = express();
app.use(express.static('dist'));
app.get('/', (req, res) => {
    const body = renderToString(React.createElement(App));
    res.send(
        html({
            body,
        }),
    );
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});
