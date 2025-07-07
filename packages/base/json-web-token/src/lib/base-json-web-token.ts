import {
  BaseJsonWebTokenSecretAdapter,
  BaseJsonWebTokenSecretOptions,
} from './jwt-secrets-adapter';
import {
  BaseJsonWebTokenPayload,
  BaseJsonWebTokenAdapter,
  TokenAdapterSigningOptions,
  TokenAdapterVerifyOptions,
  BaseJsonWebTokenSecret,
} from './jwt-adapter';

import joseTokenProvider from './jose-jwt-adapter';
import joseSecretAdapter from './jose-jwt-secrets-adapter';

export type BaseJsonWebTokenDependencies = {
  jwtAdapter: BaseJsonWebTokenAdapter;
  secretAdapter: BaseJsonWebTokenSecretAdapter;
};

export type BaseJsonWebTokenOptions = {
  signConfig?: TokenAdapterSigningOptions;
  verifyConfig?: TokenAdapterVerifyOptions;
  secretConfig?: BaseJsonWebTokenSecretOptions;
};

type BaseJsonWebTokenOptionsWithDefaults = BaseJsonWebTokenOptions &
  Required<
    Pick<
      BaseJsonWebTokenOptions,
      'signConfig' | 'verifyConfig' | 'secretConfig'
    >
  >;

/**
 * Organization wide defaults for JSON Web Token operations.
 */
const DEFAULT_OPTIONS: BaseJsonWebTokenOptionsWithDefaults = {
  signConfig: {
    expiresIn: '1h',
    alg: 'RS256',
  },
  verifyConfig: {
    algorithms: ['HS256', 'RS256', 'ES256', 'EdDSA'],
  },
  secretConfig: {
    format: 'text',
    alg: 'RSA', // Default algorithm for signing, can be overridden.
    keyOptions: undefined, // No default key options, must be provided by the user or environment.
    key: undefined, // No default key, must be provided by the user or environment.
  },
};

const DEFAULT_DEPENDENCIES: BaseJsonWebTokenDependencies = {
  jwtAdapter: joseTokenProvider,
  secretAdapter: joseSecretAdapter,
};

/**
 * BaseJsonWebToken class provides methods to create and validate JSON Web Tokens.
 * It uses a provider to handle the underlying JWT operations.
 */
export class BaseJsonWebToken {
  protected jwtAdapter: BaseJsonWebTokenAdapter;
  protected secretAdapter: BaseJsonWebTokenSecretAdapter;

  protected options: BaseJsonWebTokenOptionsWithDefaults;

  /**
   * Creates an instance of BaseJsonWebToken.
   * @param options - Optional configuration for signing and verifying tokens.
   * @param dependencies - Optional dependencies, allowing to override the JWT provider.
   */
  constructor(
    options?: BaseJsonWebTokenOptions,
    {
      jwtAdapter = DEFAULT_DEPENDENCIES.jwtAdapter,
      secretAdapter = DEFAULT_DEPENDENCIES.secretAdapter,
    } = {} as BaseJsonWebTokenDependencies
  ) {
    // Merge provided options with defaults
    // This allows for overriding specific options while keeping defaults intact.
    // TODO: Consider using a deep merge.
    this.options = {
      ...DEFAULT_OPTIONS,
      ...(options || {}),
    };

    // Validates the jwt provider exposes required functions.
    // This is a simple runtime check to ensure the provider conforms to the expected interface.
    if (
      !jwtAdapter ||
      typeof jwtAdapter.sign !== 'function' ||
      typeof jwtAdapter.verify !== 'function' ||
      typeof jwtAdapter.encode !== 'function' ||
      typeof jwtAdapter.decode !== 'function'
    ) {
      throw new Error('Dependency to JsonWebTokenProvider not met');
    }

    this.jwtAdapter = jwtAdapter;

    if (!secretAdapter || typeof secretAdapter.getSecret !== 'function') {
      throw new Error('Dependency to BaseJsonWebTokenKeyProvider not met');
    }

    this.secretAdapter = secretAdapter;
  }

  /**
   * Retrieves the secret key used for signing and verifying tokens.
   */
  protected get secret():
    | undefined
    | BaseJsonWebTokenSecret
    | Promise<BaseJsonWebTokenSecret> {
    if (!this.options?.secretConfig?.key) {
      return;
    }

    return this.secretAdapter.getSecret(this.options.secretConfig);
  }

  /**
   * Generates a JSON Web Token from a payload.
   * @param payload - The payload to encode into the token.
   * @param options - Optional sign options overrides.
   * @returns The signed JWT string.
   */
  async create(
    payload: BaseJsonWebTokenPayload,
    options?: TokenAdapterSigningOptions
  ): Promise<string> {
    const signOptions = {
      ...this.options.signConfig,
      ...(options ?? {}),
    };

    if (!this.secret) {
      return this.jwtAdapter.encode(payload);
    }

    // If a secret source is provided, retrieve the secret key.
    const secret =
      this.secret instanceof Promise ? await this.secret : this.secret;

    return this.jwtAdapter.sign(payload, secret, signOptions);
  }

  /**
   * Verifies a JWT and decodes its payload.
   * @param token - The token string to verify.
   * @param options - Optional verify options overrides.
   * @returns The decoded payload if the token is valid.
   * @throws An error if the token is invalid.
   */
  async validate(
    token: string,
    options?: TokenAdapterVerifyOptions
  ): Promise<object | string> {
    const verifyOptions = {
      ...this.options.verifyConfig,
      ...(options ?? {}),
    };

    if (!this.secret) {
      // If no secret is provided, decode the token without verification.
      return this.jwtAdapter.decode(token);
    }

    const secret =
      this.secret instanceof Promise ? await this.secret : this.secret;

    return this.jwtAdapter.verify(token, secret, verifyOptions);
  }
}
