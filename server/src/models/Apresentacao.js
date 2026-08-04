import BaseModel from "./BaseModel.js";

class Apresentacao extends BaseModel {
    static OBJ_NAME = 'apresentacao';
    static LIST_NAME = 'apresentacoes';
    static FIELDS = [
        'titulo', 'texto', 'link_texto', 'link_url', 'foto'
    ];

    constructor(object = {}) {
        super(object, Apresentacao.FIELDS);
    }
}

export default Apresentacao;