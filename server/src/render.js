/* Default modules */
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

/* My modules */
import Membros from './classes/Membros.js';
import Eventos from './classes/Eventos.js';
import { get_public_path, get_template, delete_public, copy_to_public } from './path_util.js';

function init_public() {
    delete_public();            // Clear the "public" directory before rendering the site.
    // Copy the "client/*" folders to "public/*".
    copy_to_public('css');
    copy_to_public('js');
    copy_to_public('assets');
}

/**
 * Downloads an image from a URL and saves it to a local path.
 * @param {string} output_path - The path where the downloaded image will be saved.
 * @param {string} url - The URL of the image to download.
 */
async function download_img(output_path, url) {
    try {
        const response = await axios.get(url, {responseType: 'arraybuffer'});
        fs.writeFileSync(output_path, Buffer.from(response.data));
    } catch(error) {
        console.error(`Error downloading image from ${url}:\n`, error);
    }
}

/**
 * Function to render the full site using the provided data.
 * It processes the data, downloads member images, and renders the HTML using EJS templates.
 * @param {Object} data - The data fetched from Google Sheets, containing members and events information.
 */
async function render_site(data) {
    console.log('Starting rendering site...');
    init_public();

    // Process data ======================================================
    const membros = Membros.from_rows(data.membros);
    const eventos = Eventos.filter_exibition(Eventos.from_rows(data.eventos));
    
    // Members images ====================================================
    // Create 'public/images/membros' directory if it doesn't exist
    for (const membro of membros) {
        if (membro.url_imagem) {
            const membros_path = get_public_path(`${membro.nome}.jpg`, 'images', 'membros');
            await download_img(membros_path, membro.url_imagem)
        }
    }

    // Render site =======================================================
    // We need do all the templates correctly.
    const template = get_template('index.ejs');
    const html = ejs.render(template, { membros, eventos });

    const output_path = get_public_path('index.html');
    fs.writeFileSync(output_path, html);

    console.log('Site rendered successfully!');
}

async function render_site_for_dev() {
    console.log('Starting rendering development site...');
    init_public();
    
    const index_temp = get_template('index.ejs');
    const index_html = ejs.render(index_temp, { membros: [], eventos: [] });
    const output_path = get_public_path('index.html');
    fs.writeFileSync(output_path, index_html);

    console.log('Development site rendered successfully!');
}

export { render_site, render_site_for_dev };