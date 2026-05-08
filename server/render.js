import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

import Membros from './classes/Membros.js';
import Eventos from './classes/Eventos.js';

function render_site(data) {
    const membros = Membros.from_rows(data.membros);
    const eventos = Eventos.from_rows(data.eventos);

    const template_path = path.join(process.cwd(), 'templates', 'index.ejs');
    const output_path = path.join(process.cwd(), 'public', 'index.html');

    const template = fs.readFileSync(template_path, 'utf8');
    const html = ejs.render(template, { membros, eventos });

    // Create 'public' directory if it doesn't exist
    if (!fs.existsSync(path.dirname(output_path))) {
        fs.mkdirSync(path.dirname(output_path), { recursive: true });
    }

    fs.writeFileSync(output_path, html);

    console.log('Site rendered successfully!');
}

export default render_site;