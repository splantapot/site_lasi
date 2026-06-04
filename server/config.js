// FILE TO EXPORT DEFAULT SETTINGS

// imports
import path from 'path';
const __dirname = import.meta.dirname;

// ========================================================
// Path Settings
// ========================================================
const VIEWS_PATH = path.join(__dirname, '..', 'views');
const TMP_PATH = path.join(VIEWS_PATH, 'templates')
const ASSETS_PATH = path.join(VIEWS_PATH, 'assets')
const CSS_PATH = path.join(VIEWS_PATH, 'css');
const JS_PATH = path.join(VIEWS_PATH, 'js');

// exports
export {VIEWS_PATH, TMP_PATH, ASSETS_PATH, CSS_PATH, JS_PATH}