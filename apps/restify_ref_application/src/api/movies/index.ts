import { useServer } from '../../server';
import { ApiModuleArguments, ApiModuleFactory } from '../types';
import { getMovies } from './handlers';

/**
 * @param param0
 */
function initModule(config?: ApiModuleArguments): void {
  const modulePath = config?.modulePath || '/movies';
  const server = useServer();

  // Register the movies API endpoints
  server.get(`${modulePath}/`, getMovies);
}

export default initModule as ApiModuleFactory;
