import GraphQLRepository from '../../Repository/Adapters/GraphQLRepository';

export default class GroupsRepository extends GraphQLRepository {
    constructor(entityClass, metadata) {
        super(entityClass, metadata);

        this.setUrl('http://127.0.0.1:8000/graphql');
    }
}
