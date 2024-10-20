import express from 'express';
import 'dotenv/config';
import initApp from './Src/InitApp.js';

const app = express();
initApp(app, express);
const port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);