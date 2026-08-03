import Generic from "./Generic.js";

const APRESENTACAO_FIELDS = [
    'titulo', 'texto', 'link_text', 'link_url', 'foto'
];

class Apresentacao extends Generic {
    constructor(object = {}) {
        super(object, APRESENTACAO_FIELDS);
    }
}

export {Apresentacao, APRESENTACAO_FIELDS}