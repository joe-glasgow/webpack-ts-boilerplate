import express from 'express';
import serverRenderer from './serverRender';

const app = express();
app.use(express.static('dist'));
app.use(serverRenderer());

app.listen(process.env.PORT || 8500, () => {
    console.log(`App is running: http://localhost:${process.env.PORT || 8500}`);
    console.log('Press Ctrl+C to quit.');
});

export default app;
