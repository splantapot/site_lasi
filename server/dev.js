// Opening Express APP (for deving)
import express from 'express';
const app = express();
const APP_PORT = 8080;

// Import another modules
import path from 'path';
import { VIEWS_PATH, TMP_PATH, ASSETS_PATH, NEWS_PATH, CSS_PATH, JS_PATH } from './config.js';
import APP_DATA from './src/dev/data.js';

// ========================================================
// Setup for the dev application
// ========================================================

const BUILD = {NONE: 0, SHEET: 1, IMAGE: 2, FILE: 3, ALL: 4};
/* IMAGE: includes only images download */
/* FILE: includes only files download */
/* ALL: downloads everything from sheets */

let build_mode = BUILD.NONE;
process.argv.forEach((value, index, array) => {
    // Update to build mode when used "npm run dev _operation_" command.
    // Used to render images/data while in development.
    Object.keys(BUILD).forEach((key) => {
        if (build_mode == BUILD.NONE && value.trim().toLowerCase() == key.toLowerCase()) build_mode = BUILD[key];
        else return;
    });
});

let BUILD_DATA = {};
switch (build_mode) {
    case BUILD.SHEET:
    case BUILD.IMAGE:
    case BUILD.FILE:
    case BUILD.ALL:
    default:
        BUILD_DATA = APP_DATA;
}


// Set the view engine as EJS
app.set('view engine', 'ejs');

// Serve public static files
app.set('views', TMP_PATH);
app.use('/assets', express.static(ASSETS_PATH));
app.use('/noticias', express.static(NEWS_PATH));
app.use('/css', express.static(CSS_PATH));
app.use('/js', express.static(JS_PATH));

// ========================================================
// Routing
// ========================================================

app.get('/', (req, res) => {
    res.render('index', BUILD_DATA);
});

app.get('/demo', (req, res) => {
    res.render('index-demo');
});

app.get('/projetos', (req, res) => {
    res.render('projetos');
});

app.get('/membros', (req, res) => {
    res.render('membros');
});

app.get('/seletivos', (req, res) => {
    res.render('seletivos');
});

app.get('/noticias', (req, res) => {
    res.render('noticias');
});

app.get('/acervo', (req, res) => {
    res.render('acervo');
});

app.get('/quizes', (req, res) => {
    res.render('quizes');
});

app.listen(APP_PORT);
console.log('Development app running! Available in:');
console.log(`http://localhost:${APP_PORT}/`);