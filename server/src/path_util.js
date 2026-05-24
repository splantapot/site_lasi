import fs from 'fs';
import path from 'path';

/**
 * Get a path for output files in "public" directory. Creates if not exists.
 * 
 * @param {string} filename - Name of the file to be created (e.g., 'index.html', 'membros.json').
 * @param {...string} subdirs - Additional directories to create in "public" (e.g., 'membros' => write in "public/membros/filename").
 * @returns {string} The full path for the output file.
 */
function get_public_path(filename, ...subdirs) {
    const dir_path = path.join(process.cwd(), 'public', ...subdirs);    // Directory
    const full_path = path.join(dir_path, filename);                    // Directory + filename
    if (!fs.existsSync(path.dirname(full_path))) {
        fs.mkdirSync(path.dirname(full_path), { recursive: true });
    }
    return full_path;
}

/**
 * Get a path for template files in "templates" directory.
 * 
 * @param {string} filename - Name of the template file. (e.g., 'index.ejs', 'membros.ejs').
 * @returns {string} The full path for the template file.
 */
function get_template_path(filename) {
    return path.join(process.cwd(), 'templates', filename);
}

/**
 * Get the template content as a string. (Ready to be rendered by EJS)
 */
function get_template(filename) {
    return fs.readFileSync(get_template_path(filename), 'utf8');
}

export { get_public_path, get_template_path, get_template };