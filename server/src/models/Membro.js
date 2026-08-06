import BaseModel, { formatMediaSheet } from "./BaseModel.js";

const MEMBROS_SHEET_ID = process.env.MEMBROS_SHEET_ID;

class Membro extends BaseModel {
    static OBJ_NAME = 'membro';
    static LIST_NAME = 'membros';
    static FIELDS = [
        'nome', 'data_nascimento', 'foto', 'cargo', 'departamento', 'destacar', 'media'
    ];
    static CONFIG = {bool: ['destacar']}

    constructor(object = {}) {
        super(object, Membro.FIELDS, Membro.CONFIG);
    }

    static async fromSheet() {
        const data = await super.fromSheet(MEMBROS_SHEET_ID, ['Dados', 'Media']);
        const media = formatMediaSheet(data[1]);
        const members = [];
        data[0].slice(2).forEach((row, ix) => {
            const newMember = super.fromArray(row, Membro.FIELDS, Membro.CONFIG);
            newMember['media'] = media[ix];
            members.push(newMember);
        });

        console.log(members);
        return;
    }
}

export default Membro;