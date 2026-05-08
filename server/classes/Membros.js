import Generic from "./Generic.js";
class Membros extends Generic {
    // Nome	Cargo Imagens
    constructor(row = []) {
        super();
        this.nome = row[0] || '';
        this.cargo = row[1] || '';
        this.imagem = row[2] || '';
    }
}

export default Membros;