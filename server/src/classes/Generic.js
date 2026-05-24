class Generic {
    to_json() {
        return {...this}
    }

    to_array() {
        return Object.values(this);
    }

    static from_rows(rows = []) {
        return rows.map(row => new this(row));
    }
}

export default Generic;