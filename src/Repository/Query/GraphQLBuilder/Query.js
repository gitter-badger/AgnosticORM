import Obj from '../../../Support/Obj';

export default class Query {
    /**
     * @type {string}
     */
    _query: string;

    /**
     * @type {Array}
     * @private
     */
    _fields = [];

    /**
     * @type {{}}
     * @private
     */
    _criteria: Object = {};

    /**
     * @param {string} query
     */
    constructor(query: string) {
        this._query = query;
    }

    /**
     * @return {Array}
     */
    getFields(): Array {
        return this._fields;
    }

    /**
     * @param {string} field
     * @param {*} value
     * @return {Query}
     */
    addFilter(field: string, value: any): Query {
        this._criteria[field] = value;

        return this;
    }

    /**
     * @param {string} field
     * @return {Query}
     */
    addField(field: string): Query {
        this._fields.push(field);

        return this;
    }

    /**
     * @param field
     * @param query
     * @return {Query}
     */
    merge(field: string, query: Query): Query {
        for (let sub of this.getFields()) {
            this.addField(`${field}.${sub}`);
        }

        return query;
    }

    /**
     * @param context
     * @return {string}
     * @private
     */
    _buildFields(context = {}) {
        let result = [];

        for (let field of Object.keys(context)) {
            let value = context[field];
            let sub   = value === null ? '' : ' {' + this._buildFields(value) + '}';

            result.push(field + sub);
        }

        return result.join(',\n');
    }

    /**
     * @return {string}
     * @private
     */
    _buildCriteria() {
        let result = [];

        for (let key of Object.keys(this._criteria)) {
            result.push(`${key}: ${this._criteria[key]}`);
        }

        return result.join(', ');
    }

    /**
     * @return {{}}
     * @private
     */
    _fieldsToObject() {
        let fields = {};

        for (let field of this._fields) {
            fields = Obj.set(fields, field, null);
        }

        return fields;
    }

    /**
     * @return {string}
     */
    build(): string {
        let query = `${this._query}`;

        if (Object.keys(this._criteria).length > 0) {
            query += `(${this._buildCriteria()})`;
        }

        return query + `{\n${this._buildFields(this._fieldsToObject())}}`;
    }

    /**
     * @return {string}
     */
    toString(): string {
        return this.build();
    }
}
