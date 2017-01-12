import Route from '../Route';
import Query from '../Query';
import Str from '../../Support/Str';
import Repository from './Repository';
import Collection from '../../Support/Collection';
import HttpQueryRequest from '../Requests/HttpQueryRequest';
import HttpQueryResponse from '../Response/HttpQueryResponse';

/**
 * Json Http REST repository
 */
export default class HttpRepository extends Repository {
    /**
     * @private
     */
    _routes: Object = {};

    /**
     * @private
     */
    _headers: Object = {};

    /**
     * @private
     */
    _params: Object = {};

    /**
     * @private
     */
    _url: string = '/';

    /**
     * @param entityClass
     */
    constructor(entityClass: Function) {
        super(entityClass);

        this.addHeader('Accept', 'application/json');
        this.addHeader('Content-Type', 'application/json');

        this.setRequestFormatter(HttpQueryRequest);
        this.setResponseFormatter(HttpQueryResponse);

        let resource = Str.snakeCase(this.getEntityClassName()) + 's';

        this._routes = {
            index:  new Route(resource),
            get:    new Route(`${resource}/{id}`),
            create: new Route(resource).withMethod(Route.METHOD_POST),
            update: new Route(`${resource}/{id}`).withMethod(Route.METHOD_PUT),
            remove: new Route(`${resource}/{id}`).withMethod(Route.METHOD_DELETE)
        };
    }

    /**
     * @param url
     * @return {HttpRepository}
     */
    setUrl(url: string): HttpRepository {
        this._url = url;

        return this;
    }

    /**
     * @param {string} action
     * @param {Route} route
     * @return {HttpRepository}
     */
    addRoute(action: string, route: Route): HttpRepository {
        this._routes[action] = route;

        return this;
    }

    /**
     * @param {string} name
     * @param {string} value
     * @return {HttpRepository}
     */
    addRouteParam(name: string, value: string): HttpRepository {
        this._params[name] = value;

        return this;
    }

    /**
     * @param {string} name
     * @param {string} value
     * @return {HttpRepository}
     */
    addHeader(name: string, value: string): HttpRepository {
        this._headers[name] = value;

        return this;
    }

    /**
     * @param primaryKey
     * @return {Promise.<Object>}
     */
    async find(primaryKey: any): Promise<Object> {
        let route = this.route('get', { id: primaryKey });
        let response = await this.request(route.uri, route.action);

        return this._responseFormatter.fill(response);
    }

    /**
     * @return {Promise.<Collection>}
     */
    async findAll(): Promise<Collection> {
        return await this.findBy(new Query);
    }

    /**
     * @param {Query} query
     * @return {Promise.<Collection>}
     */
    async findBy(query: Query): Promise<Collection> {
        let args     = this.requestFormatter.build(query);

        let route    = this.route('index', args);
        let response = await this.request(route.uri, route.action);
        let items    = this.responseFormatter.map(response);

        return new Collection(items);
    }

    /**
     * @param {Query} query
     * @return {Promise.<Object>}
     */
    async findOneBy(query: Query): Promise<Object> {
        query.take(1);

        return (await this.findBy(query)).first();
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async save(entity: Object<T>): Promise<boolean> {
        //
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async saveMany(entities: Array<Object>): Promise<boolean> {
        let success = true;

        for (let entity of entities) {
            let response = await this.save(entity);

            if (!response) {
                success = false;
            }
        }

        return success;
    }

    /**
     * @param {Object<T>} entity
     * @return {Promise.<boolean>}
     */
    async remove(entity: Object<T>): Promise<boolean> {
        //
    }

    /**
     * @param {Array<Object>} entities
     * @return {Promise.<boolean>}
     */
    async removeMany(entities: Array<Object>): Promise<boolean> {
        let success = true;

        for (let entity of entities) {
            let response = await this.remove(entity);

            if (!response) {
                success = false;
            }
        }

        return success;
    }

    /**
     * @param {string} action
     * @param {Object} args
     * @return {{uri: string, action: string|method}}
     */
    route(action: string, args: Object = {}): Object {
        if (!this._routes[action]) {
            throw new TypeError(`Route for action ${action} are not defined`);
        }

        let route = this._routes[action];

        let uri = this._url + route
                .withParams(this._params)
                .withParams(args)
                .build();

        return {
            uri:    uri,
            action: route.method
        };
    }

    /**
     * @param {string} uri
     * @param {string|method} method
     * @param {string|Object} body
     * @return {Promise.<*>}
     */
    async request(uri: string, method: string, body: Object): Promise<any> {
        try {
            let response = await fetch(uri, {
                method:      method,
                redirect:    'follow',
                credentials: 'same-origin',
                headers:     this._headers,
                body:        method === Route.METHOD_GET ? null : (
                    typeof body === 'string' ? body : JSON.stringify(body)
                )
            });

            try {
                return await response.json();
            } catch (e) {
                throw new TypeError('Invalid response JSON format');
            }
        } catch (e) {
            throw new Error(`Error while fetching data: ${e.message}`);
        }
    }
}
