import 'babel-polyfill';

import Id from './Mapping/Id';
import Agnostic from './Agnostic';
import Column from './Mapping/Column';
import Entity from './Mapping/Entity';
import Route from './Repository/Route';
import HttpRepository from './Repository/Adapters/HttpRepository';


let orm = new Agnostic();


class UsersRepository extends HttpRepository {
    constructor(entityClass, metadata) {
        super(entityClass, metadata);

        this.addRoute('index', new Route('users.json'));
    }
}


@Entity({ repository: UsersRepository })
class User {
    @Id()
    id = null;

    @Column()
    login = null;

    @Column({ name: 'name' })
    firstName = null;

    @Column({ name: 'any.olololo' })
    testSubValue = null;
}

orm.getRepository(User)
    .query
    .where('some', 23)
    .where('id', 42)
    .take(10)
    .get()
    .then(::console.log);
