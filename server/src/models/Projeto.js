import BaseModel from "./BaseModel.js";

class Projeto extends BaseModel {
    static OBJ_NAME = 'projeto';
    static LIST_NAME = 'projetos';
    static FIELDS = [
        'titulo', 'data', 'texto', 'media', 'miniatura', 'fotos'
    ]

    constructor(object = {}) {
        super(object, PROJETO_FIELDS, {split: ['media', 'fotos']});
    }
}

export default Projeto;