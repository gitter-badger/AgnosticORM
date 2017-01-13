import Repository from './Repository';
import Str from '../../Support/Str';


export default class HttpRepository extends Repository {
    /**
     * @type {{}}
     * @private
     */
    _headers: Object = {};

    /**
     * @type {string}
     * @private
     */
    _cors: string = '';

    /**
     * @type {string}
     * @private
     */
    _url: string = '/';

    /**
     * @param entityClass
     * @param meta
     */
    constructor(entityClass, meta) {
        super(entityClass, meta);

        this.setCorsOption('same-origin');
    }

    /**
     * @param url
     * @return {HttpRepository}
     */
    setUrl(url: string): HttpRepository {
        if (!Str.endsWith(url, '/')) {
            url += '/';
        }

        this._url = url;

        return this;
    }

    /**
     * @return {string}
     */
    getUrl(): string {
        return this._url;
    }

    /**
     * @param option
     * @return {HttpRepository}
     */
    setCorsOption(option: string): HttpRepository {
        this._cors = option;

        return this;
    }

    /**
     * @return {string}
     */
    getCorsOption(): string {
        return this._cors;
    }

    /**
     * @param name
     * @param value
     * @return {HttpRepository}
     */
    addHeader(name: string, value: string): HttpRepository {
        this._headers[name] = value;

        return this;
    }

    /**
     * @return {Object}
     */
    getHeaders(): Object {
        return this._headers;
    }

    /**
     * @param urn
     * @param method
     * @param body
     * @return {Promise.<*>}
     */
    async request(urn: string, method: string = 'GET', body: ?string = null): Promise<any> {
        try {
            return await fetch(this._url + urn, {
                method:      method,
                redirect:    'follow',
                mode:        'cors',
                credentials: this._cors,
                headers:     this._headers,
                body:        this._parseRequestBody(method, body)
            });
        } catch (e) {
            throw new Error(`Error while fetching data: ${e.message}`);
        }
    }

    /**
     * @param method
     * @param body
     * @return {*}
     * @private
     */
    _parseRequestBody(method: string, body: any): any {
        if (method === 'GET') {
            return null;
        }

        if (body instanceof FormData) {
            return body;
        }

        if (typeof body === 'string') {
            return body;
        }

        return JSON.stringify(body);
    }
}
