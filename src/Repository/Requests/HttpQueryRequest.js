import Query from '../Query';
import QueryRequest from './QueryRequest';


export default class HttpQueryRequest extends QueryRequest {
    /**
     * @return {Query}
     */
    build(query: Query): Object {
        let data   = query.data;
        let args   = this._formatCriteria(data.where);

        if (parseInt(data.limit) > 0) {
            args['_limit'] = parseInt(data.limit);
        }

        if (parseInt(data.offset) > 0) {
            args['_offset'] = parseInt(data.offset);
        }

        if (data.sort.length > 0) {
            args['_sort'] = data.sort.join(',');
        }

        return args;
    }

    /**
     * @param criteria
     * @private
     */
    _formatCriteria(criteria: Array<Criteria>) {
        let items = {};

        for (let criterion of criteria) {
            let value = criterion.value instanceof Array
                ? criterion.value.join(',')
                : criterion.value;

            items[criterion.field] = criterion.operator !== '='
                ? `(${criterion.operator})${value}`
                : value;
        }

        return items;
    }
}
