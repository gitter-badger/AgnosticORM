import Annotation from '../Annotation/Annotation';
import Target from '../Annotation/Target';

@Target('Property')
export default class Id {
    /**
     * @type {null}
     */
    name: string = null;

    /**
     * @constructor
     */
    call constructor(args) {
        return new Annotation(args).delegate(Id);
    }
}
