import BaseModel from "./BaseModel.js";

class Patrocinador extends BaseModel {
    static OBJ_NAME = 'patrocinador';
    static LIST_NAME = 'patrocinadores';
    static FIELDS = [
        'nome', 'logo', 'link', 'formato'
    ];

    constructor(object = {}) {
        super(object, Patrocinador.FIELDS);
        this.padronizeSize();
    }

    padronizeSize() {
        const current = this.formato.toLowerCase().replaceAll(' ', '');
        if (current.includes('ret'))
            this.formato = 'rect';
        else if (current.includes('cir')) 
            this.formato = 'circle';
        else 
            this.formato = 'square';
    }
}

export default Patrocinador;