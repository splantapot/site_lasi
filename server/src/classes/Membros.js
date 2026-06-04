import path from 'path';
import fetch_image from '../fetch/fetch_files.js';
import Generic from "./Generic.js";

class Membros extends Generic {
    // Nome	Cargo Imagens
    constructor(row = []) {
        super();
        this.nome = row[0] || '';
        this.cargo = row[1] || '';
        this.url_imagem = row[2] || '';
    }

    async download_img(out_path=null, show_log = false) {
        if (!this.url_imagem) return;
        await fetch_image(path.join(out_path, `${this.nome}.jpg`), this.url_imagem, show_log);
    }
}

export default Membros;