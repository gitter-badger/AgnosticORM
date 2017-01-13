import Strategy from './Strategy';
import Reader from '../Annotation/Reader';
import Obj from '../Support/Obj';
import Transfer from './Transfer';

export default class Metadata {
    /**
     * @private
     */
    _entityClass: Function<T>;

    /**
     * @private
     */
    _reader: Reader;

    /**
     * @private
     */
    _key: string;

    /**
     * @private
     */
    _properties: Object = {};

    /**
     * @private
     */
    _strategy: Strategy;

    /**
     * @param entityClass
     */
    constructor(entityClass: Function<T>) {
        this._entityClass = entityClass;
        this._reader = new Reader(entityClass);

        this._key = this._getPrimaryKey(this._reader, 'Id');
        this._properties = this._getProperties(this._reader, ['Id', 'Column']);
        this._strategy = new Strategy(this.getProperties());
    }

    /**
     * @return {Strategy}
     */
    getStrategy(): Strategy {
        return this._strategy;
    }

    /**
     * @param entity
     * @param data
     * @return {Object.<T>}
     */
    fill(entity: Object, data: Object): Object {
        return new Transfer(this._strategy)
            .from(data)
            .to(entity);
    }

    /**
     * @param entity
     * @return {Object.<T>}
     */
    serialize(entity: Object): Object {
        return new Transfer(this._strategy)
            .from(entity)
            .to({}, false);
    }

    /**
     * @param reader
     * @param definition
     * @return {string}
     * @private
     */
    _getPrimaryKey(reader: Reader, definition: string): string {
        let keys = Object.keys(this._getProperties(reader, [definition]));

        if (keys.length > 1) {
            throw new TypeError(`Composite keys are not supported`);
        } else if (keys.length === 1) {
            return keys[0];
        }

        throw new TypeError(`Entity ${this.getEntityClassName()} has no primary key definition`);
    }

    /**
     * @param reader
     * @param definitions
     * @return {Array}
     * @private
     */
    _getProperties(reader: Reader, definitions: Array): Array {
        let map = {};

        // All properties of class
        for (let property of reader.getPropertiesMetadataKeys()) {

            // Annotations of target property
            for (let annotation of reader.getPropertyAnnotations(property)) {
                if (Obj.inArray(definitions, annotation.constructor.name)) {
                    map[annotation.name || property] = property;
                }
            }
        }

        return map;
    }

    /**
     * @param args
     * @return {Object.<T>}
     */
    create(...args): Object<T> {
        let cls = this._entityClass;

        return new cls(...args);
    }

    /**
     * @return {string}
     */
    getPrimaryKeyName(): string {
        return this._key;
    }

    /**
     * @param entity
     * @return {*}
     */
    getPrimaryKey(entity: Object): any {
        return entity[this.getPrimaryKeyName()] || null;
    }

    /**
     * @return {Array}
     */
    getPropertyNames(): Array {
        let result = [];

        for (let property of Object.keys(this._properties)) {
            result.push(this._properties[property]);
        }

        return result;
    }

    /**
     * @return {Array}
     */
    getPropertyMappings(): Array {
        let result = [];

        for (let property of Object.keys(this._properties)) {
            result.push(property);
        }

        return result;
    }

    /**
     * @return {Object}
     */
    getProperties(): Object {
        return Object.assign({}, this._properties);
    }
}
