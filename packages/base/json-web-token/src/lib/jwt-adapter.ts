import { KeyObject } from 'crypto';
import type {
  JWK,
  JWTHeaderParameters,
  JWTPayload,
  JWTVerifyOptions,
  JWTVerifyResult,
  SignOptions,
} from 'jose';

interface CommonEncodingOptions {
  /**
   * The issuer of the JWT, this can be a string representing the issuer's identifier.
   * If not provided, the issuer claim will not be included in the JWT.
   * @example 'https://my-issuer.com'
   */
  issuer?: string;
  /**
   * The intended audience of the JWT.
   * This can be a single string or an array of strings.
   */
  audience?: string | string[];
  /**
   * The expiration time of the JWT.
   * This can be a number of seconds, a string (like '1h'), or a Date object.
   */
  expiresIn?: number | string | Date;
}

export const BASE_JWT_SIGNING_ALGORITHMS = [
  'EdDSA',
  'ES256',
  'ES384',
  'ES512',
  'HS256',
  'HS384',
  'HS512',
  'PS256',
  'PS384',
  'PS512',
  'RS256',
  'RS384',
  'RS512',
] as const;

export type BaseJsonWebTokenSigningAlgorithm =
  (typeof BASE_JWT_SIGNING_ALGORITHMS)[number];

export type TokenAdapterSigningOptions = JWTHeaderParameters &
  SignOptions &
  CommonEncodingOptions & {
    alg?: BaseJsonWebTokenSigningAlgorithm; // The algorithm used to sign the JWT, e.g., 'RS256', 'HS256', etc.
  };
export type TokenAdapterEncodingOptions = CommonEncodingOptions;
export type TokenAdapterVerifyOptions = JWTVerifyOptions;
export type BaseJsonWebTokenPayload = JWTPayload;
export type BaseJsonWebTokenVerificationResult<T = BaseJsonWebTokenPayload> =
  JWTVerifyResult<T>;

export type BaseJsonWebTokenSecret = CryptoKey | KeyObject | JWK | Uint8Array;

export interface BaseJsonWebTokenAdapter {
  /**
   * Generates a JSON Web Token from a payload.
   * @param payload - The payload to encode into the token.
   * @param secret - The secret key to sign the token.
   * @param options - Optional sign options.
   * @returns The signed JWT string.
   */
  sign(
    payload: BaseJsonWebTokenPayload,
    secret: BaseJsonWebTokenSecret,
    options?: TokenAdapterSigningOptions
  ): Promise<string>;

  /**
   * Verifies a JWT and decodes its payload.
   * @param token - The token string to verify.
   * @param secret - The secret key to verify the token signature.
   * @param options - Optional verify options.
   * @returns The decoded payload if the token is valid.
   * @throws An error if the token is invalid.
   */
  verify<T = BaseJsonWebTokenPayload>(
    token: string,
    secret: BaseJsonWebTokenSecret,
    options?: TokenAdapterVerifyOptions
  ): Promise<BaseJsonWebTokenVerificationResult<T>>;

  /**
   * Encodes a payload into a JWT string.
   * This method is typically used for creating a JWT without signing it.
   * @param payload
   */
  encode(payload: BaseJsonWebTokenPayload): Promise<string>;

  /**
   * Decodes a JWT without validating its signature.
   * @param token - The token string to decode.
   * @param options - Optional decode options.
   * @returns The decoded payload.
   * @throws An error if the token is invalid.
   */
  decode<T = BaseJsonWebTokenPayload>(
    token: string
  ): Promise<T & BaseJsonWebTokenPayload>;
}
