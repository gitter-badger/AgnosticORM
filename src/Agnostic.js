import Manager from './Repository/Manager';

type entity = Function | Object;

/**
 * Agnostic kernel
 */
export default class Agnostic {
    /**
     * @type {Manager}
     * @private
     */
    _repositoryManager = new Manager();

    /**
     * @param {entity} entity
     * @return {Repository}
     */
    getRepository(entity: entity): Repository {
        return this._repositoryManager.get(
            Agnostic.getClass(entity)
        );
    }

    /**
     * @return {Manager}
     */
    getRepositoryManager(): Manager {
        return this._repositoryManager;
    }

    /**
     * @param {entity} entity
     * @return {Function}
     */
    static getClass(entity: entity): Function {
        return entity instanceof Function ? entity : entity.constructor;
    }
}
