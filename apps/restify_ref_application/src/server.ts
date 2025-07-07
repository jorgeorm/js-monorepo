import corsMiddleware from 'restify-cors-middleware2';
import { Server, createServer, plugins } from 'restify';

let server: Server;

export type RestifyServerConfig = {
  clientUrls: (string | RegExp)[];
};

/**
 * Initializes a restify server with CORS and query parser middleware.
 * It sets up the server to handle CORS preflight requests and allows for query string parsing.
 * @returns {Promise<Server>} A promise that resolves to a restify server instance.
 */
export default async function initRestifyServer({
  clientUrls,
}: RestifyServerConfig): Promise<Server> {
  const cors = corsMiddleware({
    allowHeaders: ['Authorization', 'Content-Type', 'Accept'],
    exposeHeaders: ['Authorization', 'Content-Type', 'Accept'],
    preflightMaxAge: 5, // seconds
    credentials: true,
    origins: clientUrls,
  });

  server = createServer({
    name: 'restify_ref_application',
    version: '1.0.0',
    // TODO: add ability to use system wide logger through log parameter
  });

  // Setup the server plugins and pre-stuff
  server.pre(cors.preflight);
  server.use(cors.actual);

  /// Enabling parsing of requests body and query strings
  server.use(plugins.acceptParser(server.acceptable));
  server.use(plugins.queryParser());
  server.use(plugins.bodyParser());

  return server;
}

/**
 * Returns the initialized Restify server instance.
 * @returns {Server} The initialized Restify server instance.
 * @throws {Error} If the server is not initialized.
 */
export function useServer(): Server {
  if (!server) {
    throw new Error(
      'Server is not initialized. Please call initRestifyServer first.'
    );
  }

  return server;
}
