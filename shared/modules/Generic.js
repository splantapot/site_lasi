// Don't forget to update in "views/js/global.js" too.
// REMOVE IT. IT'S NOT NEEDED ANYMORE
// const MEDIA_FIELDS = [
//     'email','facebook','github','instagram','link',
//     'linkedin','linkedin','telegram','whatsapp','youtube'
// ];

class Generic {
    constructor(
        object = {}, 
        fields = [], 
        config = {split: undefined, bool: undefined}
        ) {

        const splitFields = config['split'];
        const boolFields = config['bool'];
        fields.forEach((field) => {
            const isSplit = (splitFields && Array.isArray(splitFields) && splitFields.includes(field));
            const isBool = (boolFields && Array.isArray(boolFields) && boolFields.includes(field));
            
            let value = object[field];
            if (value) {
                if (isSplit) value = this.splitData(value);
                if (isBool) value = this.validateBool(value);
                this[field] = value;
            }
        });
    }

    // Converts the instance to json object
    toJson() {
        return { ...this };
    }
    
    // Creates an instance from a json object
    static fromJson(object = {}) {
        return Object.assign(new this(), object);    
    }

    // Returns an array of the instance's values
    toArray(fields = []) {
        return fields.filter((field) => this[field]);
    }

    // Converts an array of database rows/objects into class instances
    static fromRows(rows = []) {
        return rows.map(row => this.from_json(row));
    }

    // Separates a data string in ',' and ';'
    splitData(dataStr = '') {
        return dataStr.replaceAll(';',',').split(',').map((v) => v.trim());
    }

    // Validates a bool value
    validateBool(value = '') {
        return (
            value.toString().toLowerCase().trim() === 'sim'  || 
            value.toString().toLowerCase().trim() === '1'    ||
            value.toString().toLowerCase().trim() === 'true' ||
            value === true  ||
            value === 1     
        );
    }
}

export default Generic;