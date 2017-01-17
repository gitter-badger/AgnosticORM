import GroupsRepository from "./Repository/GroupsRepository";

import User from "./User";
import Id from "../Mapping/Id";
import Entity from "../Mapping/Entity";
import Column from "../Mapping/Column";
import HasMany from "../Mapping/HasMany";


@Entity({ repository: GroupsRepository })
export default class Group {
    @Id()
    id = 0;

    @Column()
    name = 'Campaign Name';

    @Column()
    roles = [];

    @HasMany({ relatedTo: User })
    users = [];
}
