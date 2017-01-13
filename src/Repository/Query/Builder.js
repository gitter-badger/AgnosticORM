import Repository from '../Adapters/Repository';
import Collection from '../../Support/Collection';

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

export default class Builder {
    /**
     * @type {Array<Criteria>}
     * @protected
     */
    _wheres = [];

    /**
     * @type {Array<string>}
     * @protected
     */
    _orderBy = [];

    /**
     * @type {null|number}
     * @protected
     */
    _limit: ?number = null;

    /**
     * @type {null|number}
     * @protected
     */
    _skip: ?number = null;

    /**
     * @type {Repository}
     * @protected
     */
    _repo: Repository;

    /**
     * @param repo
     */
    constructor(repo) {
        this._repo = repo;
    }

    /**
     * @return {Repository}
     */
    getRepository(): Repository {
        return this._repo;
    }

    /**
     * @param {string} field
     * @param {*} operatorOrValue
     * @param {*|null} value
     * @return {Builder}
     */
    where(field: string, operatorOrValue: any, value = null): Builder {
        let criteria = new Criteria(...Builder._where(field, operatorOrValue, value));

        this._wheres.push(criteria);

        return this;
    }

    /**
     * @param {string} field
     * @return {Builder}
     */
    whereNull(field: string): Builder {
        this._wheres.push(new Criteria(field, '=', null));

        return this;
    }

    /**
     * @param {string} fields
     * @return {Builder}
     */
    orderBy(...fields): Builder {
        for (let field of fields) {
            this._orderBy.push(field);
        }

        return this;
    }

    /**
     * @param {number} count
     * @return {Builder}
     */
    take(count: number): Builder {
        this._limit = count;

        return this;
    }

    /**
     * @param {number} count
     * @return {Builder}
     */
    skip(count: number): Builder {
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
     * @return {string}
     */
    async get(): Collection {
        return await this._repo.findBy(this);
    }

    /**
     * @return {string}
     */
    getQuery(): string {
        return '';
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
