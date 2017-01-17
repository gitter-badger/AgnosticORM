import GraphQLBuilder from '../Query/GraphQLBuilder';
import HttpRepository from './HttpRepository';


export default class GraphQLRepository extends HttpRepository {
    /**
     * @param entityClass
     * @param orm
     */
    constructor(entityClass, orm) {
        super(entityClass, orm);

        this.setQueryBuilder(GraphQLBuilder);

        this.addHeader('Accept', 'application/json');
        this.addHeader('Content-Type', 'application/json');
    }

    /**
     * @param query
     * @return {Promise.<*>}
     */
    async findBy(query: GraphQLBuilder) {
        let result = await this.request(query.getQuery());

        for (let error of (result.errors || [])) {
            console.error(`GraphQL Server Error: ${error.message}`);
        }

        return result;
    }

    /**
     * @param body
     * @return {Promise.<*>}
     */
    async request(body: string) {
        let response = await super.request('', 'POST', {query: body});

        return await response.json();
    }
}
