import Builder from './Builder';
import Query from './GraphQLBuilder/Query';
import Relation from '../../Mapping/Relation';
import Metadata from '../../DataMapper/Metadata';
import GraphQLRepository from '../Adapters/GraphQLRepository';


export default class GraphQLBuilder extends Builder {
    /**
     * @return {string}
     */
    getQuery(): string {
        let query = this.getNativeQuery();

        return `query { ${query.build()} }`;
    }

    /**
     * @return {Query}
     */
    getNativeQuery(): Query {
        let query = new Query(this.getRepository().getTable());

        /* == ADD WHERES == */
        query = this._buildWhere(query);

        /* == ADD FIELDS == */
        query = this._buildFields(query);

        /* == ADD RELATIONS == */
        query = this._buildRelations(query);

        return query;
    }

    /**
     * @param query
     * @return {Query}
     * @private
     */
    _buildFields(query: Query) {
        const meta = this.getRepository().getMetadata();

        for (let field of meta.getPropertyMappings()) {
            query.addField(field);
        }

        return query;
    }

    /**
     * @param query
     * @return {Query}
     * @private
     */
    _buildRelations(query: Query) {
        const meta = this.getRepository().getMetadata();
        const relations = meta.getRelations();

        for (let relationName of Object.keys(relations)) {
            let relation = relations[relationName];

            console.log(relation.fetch);

            switch (relation.fetch) {
                case Relation.FETCH_TYPE_EAGER:
                    let repository = this.getRepository()
                        .getOrm()
                        .getRepository(relation.relatedTo);

                    if (repository instanceof GraphQLRepository) {
                        query = query.merge(repository.getTable(), repository.query.getNativeQuery().getFields());
                    } else {
                        console.error('Fetch relation for non GraphQLRepository');
                    }

                    break;
            }

        }

        return query;
    }

    /**
     * @param query
     * @return {Query}
     * @private
     */
    _buildWhere(query: Query): Query {
        for (let criterion of this._wheres) {
            if (criterion.operator !== '=') {
                throw new TypeError(`Invalid GraphQL query operator "${criterion.operator}"`);
            }

            query.addFilter(criterion.field, criterion.value);
        }

        return query;
    }
}
