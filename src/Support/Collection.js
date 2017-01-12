import Serializable from './Serializable';


export default class Collection extends Serializable {
    /**
     * @type {Array}
     * @private
     */
    _items: Array = [];

    /**
     * @param {Array} items
     */
    constructor(items: Array = []) {
        super();
        this._items = items;
    }

    /**
     * @return {*|null}
     */
    first() {
        return this._items.length > 0 ? this._items[0] : null;
    }

    /**
     * @return {Generator}
     */
    *[Symbol.iterator](): Generator {
        for (let item of this._items) {
            yield item;
        }
    }

    /**
     * @return {string}
     */
    toString(): string {
        return JSON.stringify(this._items);
    }
}
