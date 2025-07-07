import { decodeJwt, JWTPayload, jwtVerify, SignJWT, UnsecuredJWT } from 'jose';
import {
  BaseJsonWebTokenPayload,
  BaseJsonWebTokenAdapter,
  BaseJsonWebTokenSecret,
  BaseJsonWebTokenVerificationResult,
  TokenAdapterSigningOptions,
  TokenAdapterVerifyOptions,
  TokenAdapterEncodingOptions,
} from './jwt-adapter';

export function sign(
  payload: BaseJsonWebTokenPayload,
  secret: BaseJsonWebTokenSecret,
  options?: TokenAdapterSigningOptions
): Promise<string> {
  if (!secret) {
    throw new Error('BaseJsonWebTokenSecret is required for signing the JWT');
  }

  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Payload must be a non-null object');
  }

  const signer = new SignJWT(payload as JWTPayload);

  if (options?.alg) {
    signer.setProtectedHeader({ alg: options.alg });
  }

  signer.setIssuedAt();

  if (options?.issuer) {
    signer.setIssuer(options.issuer);
  }

  if (options?.audience) {
    signer.setAudience(options.audience);
  }

  if (options?.expiresIn) {
    signer.setExpirationTime(options.expiresIn);
  }

  return signer.sign(secret);
}

export function verify<T = BaseJsonWebTokenPayload>(
  token: string,
  secret: BaseJsonWebTokenSecret,
  options: TokenAdapterVerifyOptions
): Promise<BaseJsonWebTokenVerificationResult<T>> {
  return jwtVerify(token, secret, options) as Promise<
    BaseJsonWebTokenVerificationResult<T>
  >;
}

export async function encode(
  payload: BaseJsonWebTokenPayload,
  options?: TokenAdapterEncodingOptions
): Promise<string> {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Payload must be a non-null object');
  }

  const jwt = new UnsecuredJWT(payload).setIssuedAt();

  if (options?.issuer) {
    jwt.setIssuer(options.issuer);
  }
  if (options?.audience) {
    jwt.setAudience(options.audience);
  }
  if (options?.expiresIn) {
    jwt.setExpirationTime(options.expiresIn);
  }

  return jwt.encode();
}

export function decode<T = BaseJsonWebTokenPayload>(
  token: string
): Promise<T & BaseJsonWebTokenPayload> {
  return decodeJwt(token) as Promise<T & BaseJsonWebTokenPayload>;
}

export default {
  sign,
  verify,
  encode,
  decode,
} as BaseJsonWebTokenAdapter;
