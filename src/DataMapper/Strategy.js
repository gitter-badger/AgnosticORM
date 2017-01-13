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
    setDepthDelimiter(delimiter: string) {
        if (delimiter.toString().length !== 1) {
            throw new TypeError('Delimiter must be a 1-char length');
        }

        this._depthDelimiter = delimiter;
    }

    /**
     * @return {string}
     */
    getDepthDelimiter(): string {
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
    getMapping(): Object {
        return Object.assign({}, this._mapping);
    }
}
