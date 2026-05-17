import Generic from "./Generic.js";
class Eventos extends Generic {
    // Título	Data	Descrição	Exibir
    constructor(row = []) {
        super();
        this.titulo = row[0] || '';
        this.data = row[1] || '';
        this.descricao = row[2] || '';
        this.exibir = row[3] || 0;
    }

    static filter_exibition(params) {
        return params.filter(e => 
            e.exibir.toString().toLowerCase() === 'sim' || 
            e.exibir === 1 ||
            e.exibir.toString().toLowerCase() === 'true' ||
            e.exibir === true
        );
    }
}

export default Eventos;