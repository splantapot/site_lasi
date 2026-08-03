import Generic from "./Generic.js";

const MEMBRO_FIELDS = [
    'nome', 'data_nascimento', 'foto', 'cargo', 'departamento', 'destacar', 'media'
];

class Membro extends Generic {
    constructor(object = {}) {
        super(object, MEMBRO_FIELDS, {split: ['media'], bool: ['destacar']});
    }
}

export {Membro, MEMBRO_FIELDS}