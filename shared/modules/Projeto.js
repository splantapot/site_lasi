import Generic from "./Generic.js";

const PROJETO_FIELDS = [
    'titulo', 'data', 'texto', 'media', 'miniatura', 'fotos'
];

class Projeto extends Generic {
    constructor(object = {}) {
        super(object, PROJETO_FIELDS, {split: ['media', 'fotos']});
    }
}

export {Projeto, PROJETO_FIELDS}