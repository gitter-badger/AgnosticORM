export type method = Route.METHOD_GET | Route.METHOD_POST | Route.METHOD_PUT | Route.METHOD_PATCH | Route.METHOD_DELETE;

export default class Route {
    /**
     * @type {string}
     */
    static METHOD_GET = 'GET';

    /**
     * @type {string}
     */
    static METHOD_POST = 'POST';

    /**
     * @type {string}
     */
    static METHOD_PUT = 'PUT';

    /**
     * @type {string}
     */
    static METHOD_PATCH = 'PATCH';

    /**
     * @type {string}
     */
    static METHOD_DELETE = 'DELETE';

    /**
     * @param {string}
     */
    _route: string;

    /**
     * @type {method|string}
     */
    method: method = this.constructor.METHOD_GET;

    /**
     * @type {{}}
     * @private
     */
    _parameters = {};

    /**
     * @param {string} route
     */
    constructor(route: string) {
        this._route = route;
    }

    /**
     * @param {method|string} type
     * @return {Route}
     */
    withMethod(type: method): Route {
        this.method = type;

        return this;
    }

    /**
     * @param {string} key
     * @param {number|string|boolean} value
     * @return {Route}
     */
    withParam(key, value): Route {
        this._parameters[key] = value;

        return this;
    }

    /**
     * @param params
     * @return {Route}
     */
    withParams(params: Object): Route {
        for (let key of Object.keys(params)) {
            this.withParam(key, params[key]);
        }

        return this;
    }

    /**
     * @return {string}
     */
    build(): string {
        let query = [];
        let uri   = this._route;

        for (let param of Object.keys(this._parameters)) {
            let before = uri;
            let value = encodeURIComponent(this._parameters[param]);

            uri = uri.replace(`{${param}`, value);

            if (before === uri) {
                query.push(`${param}=${value}`);
            }
        }

        return uri + (query.length ? `?${query.join('&')}` : '');
    }

    /**
     * @return {string}
     */
    toString(): string {
        return this.build();
    }

    /**
     * @return {string}
     */
    [Symbol.toPrimitive]() {
        return this.toString();
    }
}
