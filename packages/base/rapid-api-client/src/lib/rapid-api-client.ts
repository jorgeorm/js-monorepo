import { RapidApiClientError } from './rapid-api-client-error';

export type RapidApiClientOptions = {
  apiKey: string;
  apiHost: string;
  contentType?: string;
};

export type RapidApiClient = {
  get: <T>(
    url: string,
    options?: Omit<RequestInit, 'method' | 'body'>
  ) => Promise<T>;
};

/**
 * Creates a RapidAPI client for making HTTP requests.
 * @param options - The options for the RapidAPI client.
 * @returns
 */
export function useRapidApiClient(
  {
    apiKey,
    apiHost,
    contentType,
  }: RapidApiClientOptions = {} as RapidApiClientOptions
): Readonly<RapidApiClient> {
  if (!apiKey || !apiHost) {
    throw new Error('Rapid Api Key and Host are required');
  }

  const baseOpenApiHeaders: HeadersInit = {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': apiHost,
    'Content-Type': contentType || 'application/json',
  };

  async function get<T>(
    url: string,
    options?: Omit<RequestInit, 'method'>
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        ...(options?.headers || {}),
        ...baseOpenApiHeaders,
      },
    });

    if (!response.ok) {
      throw new RapidApiClientError(
        `Failed to GET<${url}>: ${response.statusText}`,
        {
          resource: url,
          status: response.status,
          statusText: response.statusText,
        }
      );
    }

    return response.json() as Promise<T>;
  }

  return Object.freeze({
    get,
  });
}
