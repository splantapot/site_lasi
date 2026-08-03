// Don't forget to update in "views/js/global.js" too.
// REMOVE IT. IT'S NOT NEEDED ANYMORE
// const MEDIA_FIELDS = [
//     'email','facebook','github','instagram','link',
//     'linkedin','linkedin','telegram','whatsapp','youtube'
// ];

class Generic {
    constructor(object = {}, fields = [], splitFields = []) {
        fields.forEach((field) => {
            const needSplit = (splitFields && Array.isArray(splitFields) && splitFields.includes(field));
            const value = object[field];
            if (value) this[field] = (needSplit)? this.splitData(value) : value;
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

    splitData(dataStr = '') {
        return dataStr.replaceAll(';',',').split(',').map((v) => v.trim());
    }
}

export default Generic;