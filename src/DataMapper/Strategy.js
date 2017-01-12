import Reader from '../Annotation/Reader';

export default class Strategy {
    /**
     * @type {{}}
     * @private
     */
    _mapping: Object = {};

    /**
     * @type {string}
     * @private
     */
    _depthDelimiter: string = '.';

    /**
     * @param entity
     * @return {Strategy}
     */
    static fromEntity(entity): Strategy {
        let reader = new Reader(entity);
        let map    = {};

        for (let propertyName of reader.getPropertiesMetadataKeys()) {
            for (let annotation of reader.getPropertyAnnotations(propertyName)) {
                if (annotation.constructor.name === 'Id' || annotation.constructor.name === 'Column') {
                    map[annotation.name || propertyName] = propertyName;
                }
            }
        }

        return new Strategy(map);
    }

    /**
     * @param {Object} mapping
     */
    constructor(mapping: Object = {}) {
        for (let from of Object.keys(mapping)) {
            this.addMapping(from, mapping[from]);
        }
    }

    /**
     * @param delimiter
     */
    set depthDelimiter(delimiter: string) {
        if (delimiter.toString().length !== 1) {
            throw new TypeError('Delimiter must be a 1-char length');
        }

        this._depthDelimiter = delimiter;
    }

    /**
     * @return {string}
     */
    get depthDelimiter(): string {
        return this._depthDelimiter;
    }

    /**
     * @param {string} from
     * @param {string} to
     * @return {Strategy}
     */
    addMapping(from: string, to: string): Strategy {
        this._mapping[from] = to;

        return this;
    }

    /**
     * @return {Object}
     */
    get mapping(): Object {
        return Object.assign({}, this._mapping);
    }
}
