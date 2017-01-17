import Str from '../../Support/Str';
import Builder from '../Query/Builder';
import Metadata from '../../DataMapper/Metadata';
import Collection from '../../Support/Collection';
import Agnostic from '../../Agnostic';

/**
 * Contract for a persistence layer class to implement.
 */
export default class Repository {
    /**
     * @type {Function<T>}
     * @private
     */
    _entity: Function<T>;

    /**
     * @private
     */
    _meta: Metadata;

    /**
     * @private
     */
    _qb: Builder = Builder;

    /**
     * @private
     */
    _table: string = '';

    /**
     * @private
     */
    _orm: Agnostic;

    /**
     * @param entity
     * @param orm
     */
    constructor(entity: Function<T>, orm: Agnostic) {
        this._entity = entity;
        this._orm    = orm;
        this._meta   = orm.getMetadata(entity);

        this.setTable(Str.snakeCase(this.getEntityClassName()) + 's');
    }

    /**
     * @param qb
     * @return {Repository}
     */
    setQueryBuilder(qb: Builder): Repository {
        this._qb = qb;

        return this;
    }

    /**
     * @return {Builder}
     */
    getQueryBuilder(): Builder {
        return this._qb;
    }

    /**
     * @param name
     * @return {Repository}
     */
    setTable(name: string): Repository {
        this._table = name;

        return this;
    }

    /**
     * @return {string}
     */
    getTable(): string {
        return this._table;
    }

    /**
     * @return {Metadata}
     */
    getMetadata(): Metadata {
        return this._meta;
    }

    /**
     * @return {Agnostic}
     */
    getOrm(): Agnostic {
        return this._orm;
    }

    /**
     * @return {Builder}
     */
    get query(): Builder {
        return new this._qb(this);
    }

    /**
     * Finds an object by its primary key / identifier.
     *
     * @param primaryKey
     * @return {Promise.<Object>}
     */
    async find(primaryKey): Promise<Object> {
        return this.query.where(this._meta.getPrimaryKeyName(), primaryKey).get();
    }

    /**
     * Finds all objects in the repository.
     *
     * @return {Promise.<Collection>}
     */
    async findAll(): Promise<Collection> {
        return this.query.get();
    }

    /**
     * Finds objects by a set of criteria.
     *
     * Optionally sorting and limiting details can be passed. An implementation may throw
     * an UnexpectedValueException if certain values of the sorting or limiting details are
     * not supported.
     *
     * @param {Builder} query
     * @return {Promise.<Collection>}
     */
    async findBy(query: Builder): Promise<Collection> {
        throw new ReferenceError(`Action ${this.constructor.name}.findBy() are not implemented`);
    }

    /**
     * Finds a single object by a set of criteria.
     *
     * @param {Builder} query
     * @return {Promise.<Object>}
     */
    async findOneBy(query: Builder): Promise<Object> {
        return (await this.findBy(query)).first();
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async save(entity: Object<T>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.save() are not implemented`);
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async saveMany(entities: Array<Object>): Promise<boolean> {
        let promises = [];

        for (let entity of entities) {
            promises.push(this.save(entity));
        }

        return await Promise.all(promises);
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async remove(entity: Object<T>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.remove() are not implemented`);
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async removeMany(entities: Array<Object>): Promise<boolean> {
        let promises = [];

        for (let entity of entities) {
            promises.push(this.remove(entity));
        }

        return await Promise.all(promises);
    }

    /**
     * Returns the class of the object managed by the repository.
     *
     * @return {Function<T>}
     */
    getEntityClass(): Function<T> {
        return this._entity;
    }

    /**
     * Returns the class name of the object managed by the repository.
     *
     * @return {string}
     */
    getEntityClassName(): string {
        return this._entity.name;
    }

    /**
     * @return {string}
     */
    getPrimaryKeyName(): string {
        return this._meta.getPrimaryKeyName()
    }
}
