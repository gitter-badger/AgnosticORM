import Annotation from '../Annotation/Annotation';
import Target from '../Annotation/Target';

@Target('Property')
export default class Column {
    /**
     * @type {null}
     */
    name: string = null;

    /**
     * @type {boolean}
     */
    nullable: boolean = true;

    /**
     * @constructor
     */
    call constructor(args) {
        return new Annotation(args).delegate(Column);
    }
}
