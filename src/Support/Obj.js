export default class Obj {
    /**
     * Get an item from an array using delimiter notation.
     *
     * @param {Object.<T>} object
     * @param {string|null} key
     * @param {*} _default
     * @param {string} delimiter
     * @return {Object.<T>}
     */
    static get(object: Object<T>, key: ?string, _default: any = null, delimiter: string = '.'): Object<T> {
        if (!this.accessible(object)) {
            return this.value(_default);
        }

        if (key === null) {
            return object;
        }

        if (this.exists(object, key)) {
            return object[key];
        }

        for (let segment of key.toString().split(delimiter)) {
            if (this.accessible(object) && this.exists(object, segment)) {
                object = object[segment];
            } else {
                return this.value(_default);
            }
        }

        return object;
    }

    /**
     * Set an object item to a given value using delimiter notation.
     *
     * If no key is given to the method, the entire object will be replaced.
     *
     * @param object
     * @param key
     * @param value
     * @param delimiter
     * @return {*}
     */
    static set(object: Object<T>, key: ?string, value: any, delimiter: string = '.'): Object<T> {
        let context = object;

        if (key === null) {
            return value;
        }

        let keys = key.toString().split(delimiter);

        while (keys.length > 1) {
            key = keys.shift();

            // If the key doesn't exist at this depth, we will just create an empty object
            // to hold the next value, allowing us to create the objects to hold final
            // values at the correct depth. Then we'll keep digging into the object.
            if (typeof context[key] === 'undefined' || typeof context[key] !== 'object') {
                context[key] = {};
            }

            context = context[key];
        }

        context[keys.shift()] = value;

        return object;
    }

    /**
     * @param array
     * @param needle
     * @return {boolean}
     */
    static inArray(array: Array, needle: any): boolean {
        for (let haystack of array) {
            if (haystack === needle) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {*} object
     * @return {boolean}
     */
    static accessible(object: any): boolean {
        return object instanceof Object;
    }

    /**
     * @param {Object} object
     * @param {string} key
     * @return {boolean}
     */
    static exists(object: Object, key: string): boolean {
        return object instanceof Object && typeof object[key] !== 'undefined';
    }

    /**
     * @param {*} data
     * @return {*}
     */
    static value(data: any): any {
        return data instanceof Function ? data() : data;
    }
}
