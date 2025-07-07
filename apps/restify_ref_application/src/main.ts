import initLogger, { useLogger } from './logger';
import initRestifyServer from './server';
import initApiEndpoints from './api';

const appPort = process.env.RESTIFY_REF_APP_PORT || 8080;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:4200';

initLogger();

/**
 * Initializes the Restify reference application.
 * It sets up the logger, server, and API endpoints.
 * @returns {Promise<void>} A promise that resolves when the application is initialized.
 * @throws {Error} If there is an error during initialization.
 */
(async function initRestifyRefApp() {
  try {
    const logger = useLogger('initRestifyRefApp');
    const server = await initRestifyServer({
      clientUrls: [clientUrl],
    });

    initApiEndpoints();

    server.listen(appPort, function () {
      logger.info(`${server.name} is listening on ${server.url}`);
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    process.exit(1);
  }
})();
