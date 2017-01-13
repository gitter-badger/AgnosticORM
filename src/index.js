import 'babel-polyfill';

import Id from './Mapping/Id';
import Agnostic from './Agnostic';
import Column from './Mapping/Column';
import Entity from './Mapping/Entity';
import GraphQLRepository from './Repository/Adapters/GraphQLRepository';


let orm = new Agnostic();


class UsersRepository extends GraphQLRepository {
    constructor(entityClass, metadata) {
        super(entityClass, metadata);

        this.setUrl('http://127.0.0.1:8000/graphql');
    }
}


@Entity({ repository: UsersRepository })
class User {
    @Id()
    id = 0;

    @Column({ name: 'login' })
    name = 'Username';

    @Column({ name: 'role.title' })
    roleTitle = 'Guest';

    @Column({ name: 'role.id' })
    role = 0;
}


orm.getRepository(User)
    .query
    .where('id', 71)
    .where('role', 1)
    .get()
    .then(::console.log);


/**
 * Request:
 *
 *      POST http://127.0.0.1:8000/graphql
 *
 *      query {
 *          users (id: 71) {
 *              id
 *              login
 *              role (id: 1) {
 *                  title
 *                  id
 *              }
 *          }
 *      }
 *
 * ========
 *
 * Eloquent example:
 *
 *      User::with('role')->where('id', 71)->where('role.id', 1)->get();
 *
 * ========
 *
 * Response:
 *
 *      Content-Type: application/json
 *
 *      {
 *          "errors": null,
 *          "data: {
 *              [
 *                  "id": 71,
 *                  "login": "Vasya",
 *                  "role": {
 *                     "id": 1,
 *                     "title": "Admin"
 *                  }
 *              ]
 *          }
 *      }
 *
 * ========
 *
 * Output:
 *
 *      Collection<User> [
 *          User<Object> {
 *              id = 71;
 *              name = "Vasya";
 *              roleTitle = "Admin";
 *              role = 1;
 *          }
 *      ]
 *
 */
