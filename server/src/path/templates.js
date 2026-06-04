import fs from 'fs';
import path from 'path';

import { PUBLIC_PATH, TMP_PATH } from './../../config.js';

/**
 * Get a path for template files in "templates" directory.
 * 
 * @param {string} filename - Name of the template file. (e.g., 'index.ejs', 'membros.ejs').
 * @returns {string} The full path for the template file.
 */
function get_template_path(filename) {
    return path.join(TMP_PATH, filename);
}

/**
 * Get the template content as a string. (Ready to be rendered by EJS)
 */
function get_template(filename) {
    return fs.readFileSync(get_template_path(filename), 'utf8');
}

export { get_template, get_template_path }