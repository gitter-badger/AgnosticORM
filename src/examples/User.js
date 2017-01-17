import UsersRepository from "./Repository/UsersRepository";

import Group from "./Group";
import Id from "../Mapping/Id";
import Entity from "../Mapping/Entity";
import Column from "../Mapping/Column";
import HasMany from "../Mapping/HasMany";


@Entity({ repository: UsersRepository })
export default class User {
    @Id()
    id = 0;

    @Column({ name: 'username' })
    name = 'Campaign Name';

    @HasMany({ relatedTo: Group, fetch: HasMany.FETCH_TYPE_EAGER })
    groups = [];
}
