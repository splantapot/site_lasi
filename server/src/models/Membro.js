import BaseModel from "./BaseModel.js";

class Membro extends BaseModel {
    static OBJ_NAME = 'membro';
    static LIST_NAME = 'membros';
    static FIELDS = [
        'nome', 'data_nascimento', 'foto', 'cargo', 'departamento', 'destacar', 'media'
    ];

    constructor(object = {}) {
        super(object, Membro.FIELDS, {split: ['media'], bool: ['destacar']});
    }
}

export default Membro;