import Query from '../Query';
import Repository from '../Adapters/Repository';

export default class QueryRequest {
    /**
     * @private
     */
    _repository: Repository;

    /**
     * @return {Repository}
     */
    get repository(): Repository {
        return this._repository;
    }

    /**
     * @param repository
     */
    constructor(repository: Repository) {
        this._repository = repository;
    }

    /**
     * @param query
     * @return {Object}
     */
    build(query: Query): Object {
        return {};
    }
}
