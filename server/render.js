import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

import Membros from './classes/Membros.js';
import Eventos from './classes/Eventos.js';

function render_site(data) {
    const members_row = Membros.from_rows(data.membros);
    console.log(members_row);
    const events_row = Eventos.from_rows(data.eventos);
    console.log(events_row);
}

export default render_site;