class Criteria {
    /**
     * @type {string}
     */
    _field: string;

    /**
     * @type {string}
     */
    _operator: string;

    /**
     * @type {*}
     */
    _value: any;

    /**
     * @param field
     * @param operator
     * @param value
     */
    constructor(field, operator, value) {
        this._field    = field;
        this._operator = operator;
        this._value    = value;
    }

    /**
     * @return {string}
     */
    get field(): string {
        return this._field;
    }

    /**
     * @return {string}
     */
    get operator(): string {
        switch (this._operator) {
            case '=':
            case '==':
            case '===':
                return '=';
            case '!=':
            case '!==':
            case '<>':
                return '<>';
        }

        return this._operator;
    }

    /**
     * @return {string}
     */
    get value(): string {
        return this._value;
    }
}


export default class Query {
    /**
     * @type {Array<Criteria>}
     * @private
     */
    _wheres = [];

    /**
     * @type {Array<string>}
     * @private
     */
    _orderBy = [];

    /**
     * @type {null}
     * @private
     */
    _limit = null;

    /**
     * @type {null}
     * @private
     */
    _skip = null;

    /**
     * @param {string} field
     * @param {*} operatorOrValue
     * @param {*|null} value
     * @return {Query}
     */
    where(field: string, operatorOrValue: any, value = null): Query {
        let criteria = new Criteria(...Query._where(field, operatorOrValue, value));

        this._wheres.push(criteria);

        return this;
    }

    /**
     * @param {string} field
     * @return {Query}
     */
    whereNull(field: string): Query {
        this._wheres.push(new Criteria(field, '=', null));

        return this;
    }

    /**
     * @param {string} fields
     * @return {Query}
     */
    orderBy(...fields): Query {
        for (let field of fields) {
            this._orderBy.push(field);
        }

        return this;
    }

    /**
     * @param {number} count
     * @return {Query}
     */
    take(count: number): Query {
        this._limit = count;

        return this;
    }

    /**
     * @param {number} count
     * @return {Query}
     */
    skip(count: number): Query {
        this._skip = count;

        return this;
    }

    /**
     * @param {string} field
     * @param {*} operatorOrValue
     * @param {*|null} value
     * @return {Array}
     * @private
     */
    static _where(field: string, operatorOrValue: any, value = null): Array {
        return value === null
            ? [field, '=', operatorOrValue]
            : [field, operatorOrValue, value];
    }

    /**
     * @return {{where: Array.<Criteria>, limit: number|null, offset: number|null, sort: Array.<string>}}
     */
    get data(): Object {
        return {
            where:  this._wheres,
            limit:  this._limit,
            offset: this._skip,
            sort:   this._orderBy
        };
    }
}
