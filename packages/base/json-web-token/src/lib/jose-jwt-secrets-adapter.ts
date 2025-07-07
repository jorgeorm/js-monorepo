import { BaseJsonWebTokenSecret } from './jwt-adapter';
import { importPKCS8, importJWK, JWK, importSPKI, importX509 } from 'jose';
import {
  BaseJsonWebTokenSecretOptions,
  BaseJsonWebTokenSecretAdapter,
  SECRET_PROVIDER_DEFAULT_OPTIONS,
} from './jwt-secrets-adapter';

export default {
  getSecret: (
    options: BaseJsonWebTokenSecretOptions = SECRET_PROVIDER_DEFAULT_OPTIONS
  ): BaseJsonWebTokenSecret | Promise<BaseJsonWebTokenSecret> => {
    const { format, alg, keyOptions, key } = options;

    if (format === 'text') {
      return new TextEncoder().encode(key as string);
    }

    if (format === 'pkcs8') {
      return importPKCS8(key as string, alg as string, keyOptions);
    }

    if (format === 'jwk') {
      return importJWK(key as JWK, alg as string, keyOptions);
    }

    if (format === 'spki') {
      return importSPKI(key as string, alg as string, keyOptions);
    }

    if (format === 'x509') {
      return importX509(key as string, alg as string, keyOptions);
    }

    // TODO: review how this key resolver works, it seems it uses the signed token
    // if (format === 'remote-jwks') {
    //   const jwksClient = createRemoteJWKSet(key as string);

    //   return jwksClient();
    // }

    throw new Error('Unknown secret format, cannot import provided key');
  },
} as BaseJsonWebTokenSecretAdapter;
