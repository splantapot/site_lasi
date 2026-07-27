import fs from 'fs';
import path from 'path';

import { ASSETS_PATH, CSS_PATH, JS_PATH, BUILD_PATH } from './../../config.js';

/**
 * Deletes the "public" directory and all its contents.
 */
function delete_public() {
    console.log('>> Deleting "public" folder...');
    if (fs.existsSync(BUILD_PATH)) {
        fs.rmSync(BUILD_PATH, { recursive: true });
        console.log('Done!');
    }
}

/**
 * Creates a folder inside "public/assets" directory.
 */
function create_in_assets(folder_name = null) {
    console.log(`>> Creates "public/assets/${folder_name}" folder...`);
    const new_path = path.join(ASSETS_PATH, folder_name);
    if (!fs.existsSync(new_path)) {
        fs.mkdirSync(new_path, { recursive: true });
        console.log('Done!');
    }
    return new_path;
}

/**
 * Copies a "src_path" folder to "out_path".
 * @param {string} src_path - The source path.
 * @param {string} out_path - The output path.
 */
function copy_folder(src_path, out_path) {
    if (fs.existsSync(src_path)) {
        fs.cpSync(src_path, out_path, { recursive: true, force: true });
    } else {
        console.warn(`Warning: Folder not found at ${src_path}`);
    }
}

/**
 * Copies the "views" subfolders and all its contents to "public"
 */
function copy_view_to_public() {
    console.log('>> Copying "views" folder...');
    copy_folder(ASSETS_PATH, path.join(BUILD_PATH, 'assets'));
    copy_folder(CSS_PATH, path.join(BUILD_PATH, 'css'));
    copy_folder(JS_PATH, path.join(BUILD_PATH, 'js'));
    console.log('Done!');
}

/**
 * Get a path for output ".html" files in "public" directory. Creates if not exists.
 * 
 * @param {string} filename - Name of the file to be created (e.g., 'index.html', 'membros.json').
 * @returns {string} The full path for the output file.
 */
function get_html_path(filename) {
    const full_path = path.join(BUILD_PATH, filename);                    // Directory + filename
    if (!fs.existsSync(path.dirname(full_path))) {
        fs.mkdirSync(path.dirname(full_path), { recursive: true });
    }
    return full_path;
}

export {
    delete_public, copy_folder,
    create_in_assets,
    copy_view_to_public,
    get_html_path
}