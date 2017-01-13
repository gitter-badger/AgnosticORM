import Builder from './Builder';
import Obj from '../../Support/Obj';
import Str from '../../Support/Str';

export default class GraphQLBuilder extends Builder {
    /**
     * @return {string}
     */
    getQuery(): string {
        let repo  = this.getRepository();

        let graph = this._createObjectGraph();

        graph = this._createWhereQuery(graph);

        graph = this._compileGraph({ [repo.getTable()]: graph });

        graph = this._format(`query ${graph}`);

        return graph;
    }

    /**
     * @return {{}}
     * @private
     */
    _createWhereQuery(graph: Object) {
        const map = this.getRepository().getMetadata().getProperties();

        let getMapName = name => {
            for (let field of Object.keys(map)) {
                if (map[field] === name) {
                    return field;
                }
            }

            throw new TypeError(`Field ${name} not defined in ${this.getRepository().getEntityClassName()} entity`);
        };

        for (let criterion of this._wheres) {
            if (criterion.operator !== '=') {
                throw new TypeError(`Operator ${criterion.operator} are not allowed for GraphQL queries`);
            }

            graph = Obj.set(graph, getMapName(criterion.field), criterion.value);
        }

        return graph;
    }

    /**
     * @return {{}}
     * @private
     */
    _createObjectGraph() {
        const meta      = this.getRepository().getMetadata();
        const map       = meta.getPropertyMappings();
        const delimiter = meta.getStrategy().getDepthDelimiter();

        let graph = {};

        for (let key of map) {
            graph = Obj.set(graph, key, null, delimiter);
        }

        return graph;
    }

    /**
     * @param graph
     * @return {string}
     * @private
     */
    _compileGraph(graph: Object): string {
        let result = '{\n';

        let where  = [];

        for (let leaf of Object.keys(graph)) {
            let value = graph[leaf];

            result += leaf;

            if (value) {
                if (typeof value === 'object') {
                    result += ` ${this._compileGraph(value)}`;
                } else {
                    where.push(`${leaf}: ${value}`);
                }
            }

            result += "\n";
        }

        if (where.length > 0) {
            result = `(${where.join(', ')}) ${result}`
        }

        return result + '}';
    }


    /**
     * @param graph
     * @return {string}
     * @private
     */
    _format(graph: string) {
        let level = 0;

        return graph.replace(/(^.*?$)/gm, (i, group) => {
            if (Str.endsWith(group, '}')) {
                level -= 1;
            }

            let result = Str.repeat(' ', level * 4) + group;

            if (Str.endsWith(group, '{')) {
                level += 1;
            }

            return result;
        });
    }
}
