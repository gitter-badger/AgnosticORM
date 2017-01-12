import Annotation from '../Annotation/Annotation';
import Target from '../Annotation/Target';

@Target("Class")
export default class Entity {
    /**
     * @type {boolean}
     */
    readOnly: boolean = false;

    /**
     * @type {Function|null}
     */
    repository: ?Function = null;

    /**
     * @constructor
     */
    call constructor(args) {
        return new Annotation(args, 'repository').delegate(Entity);
    }
}
