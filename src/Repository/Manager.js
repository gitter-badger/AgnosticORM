import Reader from '../Annotation/Reader';
import Repository from "./Adapters/Repository";
import Agnostic from '../Agnostic';


export default class Manager {
    /**
     * @type {Repository}
     * @private
     */
    _default = Repository;

    /**
     * @type {WeakMap<Object, Repository>}
     * @private
     */
    _repositories = new WeakMap();

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
     * @return {Repository}
     */
    get(entity): Repository {
        if (!this._repositories.has(entity)) {
            this._repositories.set(entity, this.create(entity));
        }

        return this._repositories.get(entity);
    }

    /**
     * @param {Object} entity
     * @return {Repository}
     */
    create(entity): Repository {
        let annotation = new Reader(entity).getClassAnnotation('Entity');

        if (annotation === null) {
            throw new TypeError(`Entity ${entity.name} require @Entity annotation`);
        }

        let repositoryClass = annotation.repository || this._default;

        return new repositoryClass(entity, this._orm.getMetadata(entity));
    }
}
