import BaseModel from "./BaseModel.js";

class Projeto extends BaseModel {
    static OBJ_NAME = 'projeto';
    static LIST_NAME = 'projetos';
    static FIELDS = [
        'titulo', 'data', 'texto', 'miniatura', 'media', 'fotos'
    ];

    constructor(object = {}) {
        super(object, Projeto.FIELDS);
    }
}

export default Projeto;