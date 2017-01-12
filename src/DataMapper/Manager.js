import Metadata from './Metadata';
import Agnostic from '../Agnostic';

export default class Manager {
    /**
     * @type {WeakMap<Object, Metadata>}
     * @private
     */
    _metadata = new WeakMap();

    /**
     * @private
     */
    _orm: Agnostic;

    /**
     * @param orm
     */
    constructor(orm: Agnostic) {
        this._orm = orm;
    }

    /**
     * @param {Object} entity
     * @return {Metadata}
     */
    get(entity: Object): Metadata {
        if (!this._metadata.has(entity)) {
            this._metadata.set(entity, new Metadata(entity));
        }

        return this._metadata.get(entity);
    }
}
