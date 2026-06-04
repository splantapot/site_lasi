// FILE TO EXPORT DEFAULT SETTINGS

// imports
import path from 'path';
const __dirname = import.meta.dirname;

// ========================================================
// Path Settings
// ========================================================
const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const VIEWS_PATH = path.join(__dirname, '..', 'views');
const TMP_PATH = path.join(VIEWS_PATH, 'templates')
const ASSETS_PATH = path.join(VIEWS_PATH, 'assets')
const CSS_PATH = path.join(VIEWS_PATH, 'css');
const JS_PATH = path.join(VIEWS_PATH, 'js');

// exports
export { PUBLIC_PATH, VIEWS_PATH, TMP_PATH, ASSETS_PATH, CSS_PATH, JS_PATH};

// ========================================================
// WEB APP Settings
// ========================================================
process.loadEnvFile('./.env');
const WEB_APP_URL = process.env.WEB_APP_URL; // I NEED TO REPLACE BY NETLIFY ENV VAR!
const WEB_APP_TIMEOUT = 10000;  // Download data in 10 seconds, otherwise throw error

export { WEB_APP_URL, WEB_APP_TIMEOUT };