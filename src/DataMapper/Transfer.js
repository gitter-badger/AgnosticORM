import Strategy from './Strategy';
import Obj from '../Support/Obj';

export default class Transfer {
    /**
     * @type {Strategy}
     */
    _strategy: Strategy;

    /**
     * @type {{}}
     * @private
     */
    _from: Object = {};

    /**
     * @param {Strategy} strategy
     */
    constructor(strategy: Strategy) {
        this._strategy = strategy;
    }

    /**
     * @return {Strategy}
     */
    get strategy(): Strategy {
        return this._strategy;
    }

    /**
     * @param {Object} source
     * @return {Transfer}
     */
    from(source: Object): Transfer {
        this._from = Object.assign(this._from, source);

        return this;
    }

    /**
     * @param target
     * @param direct
     * @return {Object.<T>}
     */
    to(target: Object<T>, direct: boolean = true): Object<T> {
        const mapping   = this.strategy.mapping;
        const delimiter = this.strategy.depthDelimiter;

        for (let from of Object.keys(mapping)) {
            let to = mapping[from];

            target = Obj.set(
                target,
                direct ? to : from,
                Obj.get(
                    this._from,
                    direct ? from : to,
                    null,
                    delimiter
                )
            );
        }

        return target;
    }
}
