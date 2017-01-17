import Relation from './Relation';
import Annotation from '../Annotation/Annotation';
import Target from '../Annotation/Target';

@Target('Property')
export default class HasOne extends Relation {
    /**
     * @constructor
     */
    call constructor(args) {
        return new Annotation(args).delegate(HasOne);
    }
}
