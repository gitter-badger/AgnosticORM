import Query from '../Query';
import Reader from '../../Annotation/Reader';
import Strategy from '../../DataMapper/Strategy';
import Collection from '../../Support/Collection';
import QueryRequest from '../Requests/QueryRequest';
import QueryResponse from '../Response/QueryResponse';

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
     * @type {Reader}
     * @private
     */
    _reader: Reader;

    /**
     * @type {string}
     * @private
     */
    _primaryKey: string;

    /**
     * @type {QueryRequest}
     * @private
     */
    _requestFormatter: QueryRequest;

    /**
     * @return {QueryRequest}
     */
    get requestFormatter(): QueryRequest {
        return this._requestFormatter;
    }

    /**
     * @type {QueryResponse}
     * @private
     */
    _responseFormatter: QueryResponse;

    /**
     * @return {QueryResponse}
     */
    get responseFormatter(): QueryResponse {
        return this._responseFormatter;
    }

    /**
     * @type {Strategy}
     * @private
     */
    _strategy: Strategy;

    /**
     * @return {Strategy}
     */
    get strategy(): Strategy {
        return this._strategy;
    }

    /**
     * @param {Function<T>} entity
     */
    constructor(entity: Function<T>) {
        this._entity = entity;
        this._reader = new Reader(entity);
        this._primaryKey = this._getPrimaryKey();

        this.setRequestFormatter(QueryRequest);
        this.setResponseFormatter(QueryResponse);

        this.setMappingStrategy(Strategy.fromEntity(entity));
    }

    /**
     * @param strategy
     * @return {Repository}
     */
    setMappingStrategy(strategy: Strategy): Repository {
        this._strategy = strategy;

        return this;
    }

    /**
     * @param request
     * @return {Repository}
     */
    setRequestFormatter(request: QueryRequest): Repository {
        this._requestFormatter = new request(this);

        return this;
    }

    /**
     * @param response
     * @return {Repository}
     */
    setResponseFormatter(response: QueryResponse): Repository {
        this._responseFormatter = new response(this);

        return this;
    }

    /**
     * @return {string}
     * @private
     */
    _getPrimaryKey(): string {
        let properties = this._reader.getPropertiesMetadataKeys();

        for (let property of properties) {
            let annotation = this._reader.getPropertyAnnotation('Id', property);

            if (annotation !== null) {
                return property;
            }
        }

        throw new TypeError(`Entity ${this.getEntityClassName()} has no primary key definition`);
    }

    /**
     * @return {Query|{get: Promise}}
     */
    get query(): Promise<Query> {
        let _self = this;
        let query = new Query();

        query.get = function () {
            return _self.findBy(this);
        };

        return query;
    }

    /**
     * Finds an object by its primary key / identifier.
     *
     * @param primaryKey
     * @return {Promise.<Object>}
     */
    async find(primaryKey): Promise<Object> {
        throw new ReferenceError(`Action ${this.constructor.name}.find() are not allowed`);
    }

    /**
     * Finds all objects in the repository.
     *
     * @return {Promise.<Collection>}
     */
    async findAll(): Promise<Collection> {
        throw new ReferenceError(`Action ${this.constructor.name}.findAll() are not allowed`);
    }

    /**
     * Finds objects by a set of criteria.
     *
     * Optionally sorting and limiting details can be passed. An implementation may throw
     * an UnexpectedValueException if certain values of the sorting or limiting details are
     * not supported.
     *
     * @param {Query} query
     * @return {Promise.<Collection>}
     */
    async findBy(query: Query): Promise<Collection> {
        throw new ReferenceError(`Action ${this.constructor.name}.findBy() are not allowed`);
    }

    /**
     * Finds a single object by a set of criteria.
     *
     * @param {Query} query
     * @return {Promise.<Object>}
     */
    async findOneBy(query: Query): Promise<Object> {
        throw new ReferenceError(`Action ${this.constructor.name}.findOneBy() are not allowed`);
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async save(entity: Object<T>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.save() are not allowed`);
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async saveMany(entities: Array<Object>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.saveMany() are not allowed`);
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async remove(entity: Object<T>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.remove() are not allowed`);
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async removeMany(entities: Array<Object>): Promise<boolean> {
        throw new ReferenceError(`Action ${this.constructor.name}.removeMany() are not allowed`);
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
        return this._primaryKey;
    }
}
