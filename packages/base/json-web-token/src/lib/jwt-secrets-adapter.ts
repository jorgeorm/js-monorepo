import { KeyImportOptions } from 'jose';
import { BaseJsonWebTokenSecret } from './jwt-adapter';

export const BASE_JWT_SECRET_TYPES = [
  'Ed25519',
  'NIST.P-256',
  'NIST.P-384',
  'NIST.P-521',
  'secret.32byte',
  'secret.48byte',
  'secret.64byte',
  'RSA',
] as const;

export type BaseJsonWebTokenSecretKeyAlgorithm =
  (typeof BASE_JWT_SECRET_TYPES)[number];

export const SUPPORTED_KEY_FORMATS = [
  'remote-jwks',
  'jwk',
  'pkcs8',
  'text',
  'spki',
  'x509',
] as const;
export type BaseJsonWebTokenSecretKeyFormat =
  (typeof SUPPORTED_KEY_FORMATS)[number];

export type BaseJsonWebTokenSecretOptions = {
  format?: BaseJsonWebTokenSecretKeyFormat;
  alg?: BaseJsonWebTokenSecretKeyAlgorithm;
  keyOptions?: KeyImportOptions;
  key?: BaseJsonWebTokenSecret;
};

export const SECRET_PROVIDER_DEFAULT_OPTIONS: Pick<
  Required<BaseJsonWebTokenSecretOptions>,
  'alg' | 'format'
> = {
  format: 'text',
  alg: 'RSA',
};

export interface BaseJsonWebTokenSecretAdapter {
  getSecret(
    options: BaseJsonWebTokenSecretOptions
  ): BaseJsonWebTokenSecret | Promise<BaseJsonWebTokenSecret>;
}
