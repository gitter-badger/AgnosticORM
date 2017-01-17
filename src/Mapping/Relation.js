export default class Relation {
    /**
     * @type {string}
     */
    static FETCH_TYPE_EAGER: string = 'EAGER';

    /**
     * @type {string}
     */
    static FETCH_TYPE_LAZY: string = 'LAZY';

    /**
     * @type {string}
     */
    static FETCH_TYPE_EXTRA_LAZY: string = 'EXTRA_LAZY';

    /**
     * @type {Function<T>}
     */
    relatedTo: ?Function<T> = null;

    /**
     * @type {string}
     */
    fetch: string = 'EXTRA_LAZY';

    /**
     * @return {void}
     */
    validate() {
        if (this.relatedTo === null) {
            let error = `Invalid relation definition: ${this.constructor.name}.relatedTo must be a valid entity class`;

            throw new TypeError(error);
        }
    }
}
