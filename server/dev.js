// Opening Express APP (for deving)
import express from 'express';
const app = express();
const APP_PORT = 8080;

// Import another modules
import path from 'path';
import { VIEWS_PATH, TMP_PATH, ASSETS_PATH, CSS_PATH, JS_PATH } from './config.js';

// ========================================================
// Setup for the dev application
// ========================================================

let build_mode = false;
process.argv.forEach((value, index, array) => {
    // Update to build mode when used "devb" command.
    // Used to render images/data while in development.
    if (value == 'build') build_mode = true;
})

// Set the view engine as EJS
app.set('view engine', 'ejs');

// Serve public static files
app.set('views', TMP_PATH);
app.use('/assets', express.static(ASSETS_PATH));
app.use('/css', express.static(CSS_PATH));
app.use('/js', express.static(JS_PATH));

// ========================================================
// Routing
// ========================================================

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(APP_PORT);
console.log('Development app running! Available in:');
console.log(`http://localhost:${APP_PORT}/`);