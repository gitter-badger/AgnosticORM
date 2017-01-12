import Repository from '../Adapters/Repository';
import Transfer from '../../DataMapper/Transfer';


export default class QueryResponse {
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
     * @param items
     * @param direct
     * @return {Array}
     */
    map(items: Array, direct: boolean = true): Array {
        let result = [];

        for (let item of items) {
            result.push(this.fill(item, direct));
        }

        return result;
    }

    /**
     * @param item
     * @param direct
     * @return {Object}
     */
    fill(item: Object, direct: boolean = true): Object {
        let cls = this.repository.getEntityClass();

        return (new Transfer(this.repository.strategy))
            .from(item)
            .to(new cls(item), direct);
    }
}