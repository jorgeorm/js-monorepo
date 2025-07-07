import initializeMovies from './movies';
import { ApiModuleFactory } from './types';

function initializeApi(config?: { modulePath: string } | undefined): void {
  const modulePath = config?.modulePath || '/api';

  // Initialize the API modules
  initializeMovies({ modulePath: `${modulePath}/movies` });
}

export default initializeApi as ApiModuleFactory;
