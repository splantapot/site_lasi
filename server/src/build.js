// Default modules
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// My modules 
import Membros from './classes/Membros.js';
import Eventos from './classes/Eventos.js';
import { copy_view_to_public, create_in_assets, delete_public, get_html_path } from './path/public.js';
import { get_template } from './path/templates.js';
import { ASSETS_PATH } from '../config.js';
import { rejects } from 'assert';

/**
 * Function to build the '.html' using its respective '.ejs' file.
 * @param {string} filename - The ejs file to build. Must ommite extension. Ex: "index"
 * @param {Object} data - The data used to render the page.
 */
function build_html(filename = null, data = null) {
    const ejs_name = `${filename}.ejs`;
    const html_name = `${filename}.html`;

    const template = get_template(ejs_name);
    const html_data = ejs.render(template, data);

    const output_path = get_html_path(html_name);
    fs.writeFileSync(output_path, html_data);
}

/**
 * Function to render the full site using the provided data.
 * It processes the data, downloads member images, and renders the HTML using EJS templates.
 * @param {Object} data - The data fetched from Google Sheets, containing members and events information.
 */
async function build_website(data) {
    console.log("\n=== Starting Website building ===\n");
    delete_public();
    copy_view_to_public();

    // Processing Members Data ================================================
    const membros = Membros.from_rows(data.membros);
    const membros_path = create_in_assets('membros');
    // Waits all downloads
    console.log("Downloading images to 'membros'...");
    await Promise.all(
        membros.map(async (membro) => {
            await membro.download_img(membros_path, false);
        })
    );

    // Processing Members Data ================================================
    const eventos = Eventos.filter_exibition(Eventos.from_rows(data.eventos));

    // Render site ============================================================
    // We need do all the templates correctly.
    build_html('index');

    console.log('Site rendered successfully!');

}

export { build_website };
export default build_website;