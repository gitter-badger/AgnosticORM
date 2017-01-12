import { default as RepositoryManager } from './Repository/Manager';
import { default as MetadataManager } from './DataMapper/Manager';
import Repository from './Repository/Adapters/Repository';
import Metadata from './DataMapper/Metadata';

type entity = Function | Object;

/**
 * Agnostic kernel
 */
export default class Agnostic {
    /**
     * @type {RepositoryManager}
     * @private
     */
    _repositoryManager: RepositoryManager = new RepositoryManager(this);

    /**
     * @type {MetadataManager}
     * @private
     */
    _metadataManager: MetadataManager = new MetadataManager(this);

    /**
     * @param {entity} entity
     * @return {Repository}
     */
    getRepository(entity: entity): Repository {
        return this._repositoryManager.get(Agnostic.getClass(entity));
    }

    /**
     * @return {Manager}
     */
    getRepositoryManager(): RepositoryManager {
        return this._repositoryManager;
    }

    /**
     * @param entity
     * @return {*}
     */
    getMetadata(entity: entity): Metadata {
        return this._metadataManager.get(Agnostic.getClass(entity));
    }

    /**
     * @return {MetadataManager}
     */
    getMetadataManager(): MetadataManager {
        return this._metadataManager;
    }

    /**
     * @param {entity} entity
     * @return {Function}
     */
    static getClass(entity: entity): Function {
        return entity instanceof Function ? entity : entity.constructor;
    }
}
