export default class Obj {
    /**
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
     * TODO
     * @param object
     * @param key
     * @param value
     * @return {Object.<T>}
     */
    static set(object: Object<T>, key: ?string, value: any): Object<T> {
        object[key] = value;

        return object;
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
