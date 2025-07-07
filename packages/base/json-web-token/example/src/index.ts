#!/usr/bin/env node

import { BaseJsonWebToken } from '../../src/lib/base-json-web-token';
import inquirer, { DistinctQuestion } from 'inquirer';
import {
  KEY_ALG_MESSAGES,
  PKGJSON_INFO,
  SAMPLE_SECRETS,
  USER_INFO_PAYLOAD,
} from './constants';
import {
  BASE_JWT_SIGNING_ALGORITHMS,
  TokenAdapterSigningOptions,
  TokenAdapterVerifyOptions,
} from '../../src/lib/base-json-web-token-adapter';
import {
  BASE_JWT_SECRET_TYPES,
  BaseJsonWebTokenSecretOptions,
} from '../../src/lib/base-json-web-token-secrets-adapter';

const NO_ANSWER = 'N/A';

type ExampleFeatureConfig = {
  jwt: BaseJsonWebToken;
  isSigning?: boolean;
};

async function runCreateTokenExample({ jwt, isSigning }: ExampleFeatureConfig) {
  const createQuestions: DistinctQuestion[] = [
    {
      when: () => isSigning,
      type: 'list',
      name: 'algorithm',
      message:
        'Select signing algorithm, see algorithm constraints https://github.com/panva/jose/issues/210#jws-alg)',
      choices: [...BASE_JWT_SIGNING_ALGORITHMS],
      default: 'RS256',
    },
    {
      type: 'confirm',
      name: 'useExamplePayload',
      message: 'Use example payload?',
      default: true,
    },
    {
      when: (answers) => !answers.useExamplePayload,
      type: 'input',
      name: 'payload',
      message: 'Enter payload (in JSON format):',
      filter: (input: string) => JSON.parse(input),
    },
    {
      name: 'issuer',
      type: 'input',
      message: 'Enter issuer (optional):',
      default: NO_ANSWER,
    },
    {
      name: 'audience',
      type: 'input',
      message: 'Enter audience (optional):',
      default: NO_ANSWER,
    },
    {
      name: 'expiresIn',
      type: 'input',
      message: 'Enter expiration time (ie: 1h, optional):',
      default: '1h',
    },
  ];

  const {
    algorithm,
    useExamplePayload,
    payload: customPayload,
    issuer,
    audience,
    expiresIn,
  } = await inquirer.prompt(createQuestions);

  const payload = useExamplePayload ? USER_INFO_PAYLOAD : customPayload || {};

  const signOptions: TokenAdapterSigningOptions = {
    issuer: issuer !== NO_ANSWER ? issuer : undefined,
    audience: audience !== NO_ANSWER ? audience : undefined,
    expiresIn: expiresIn || '1h',
    alg: algorithm,
  };

  try {
    const token = await jwt.create(payload, signOptions);

    const { confirmNext } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmNext',
      message: 'Do you want to validate the token now?',
      default: true,
    });

    if (confirmNext) {
      try {
        const validation = await jwt.validate(token);
        console.log('Validated Token:', validation);
      } catch (error) {
        console.error('Error validating token:', error);
      }
    }
  } catch (error) {
    console.error('Error creating token:', error);
  }
}

async function runValidateTokenExample({ jwt }: ExampleFeatureConfig) {
  const validateQuestions: DistinctQuestion[] = [
    {
      type: 'input',
      name: 'token',
      message: 'Enter token:',
    },
    {
      type: 'input',
      name: 'verifyOptions',
      message: 'Enter verify options (in JSON format, optional):',
      filter: (input: string) =>
        input && input.length ? JSON.parse(input) : undefined,
    },
  ];

  const { token, verifyOptions } = await inquirer.prompt(validateQuestions);

  try {
    const result = await jwt.validate(
      token,
      verifyOptions as TokenAdapterVerifyOptions
    );
    console.log('Token is valid. Decoded token:', result);
  } catch (error) {
    console.error('Error validating token:', error);
  }
}

type ExampleFeature = {
  name: string;
  fn: (args: ExampleFeatureConfig) => Promise<void>;
};

export async function runExampleCli() {
  const features: Record<string, ExampleFeature> = {
    create: { name: 'Create Token', fn: runCreateTokenExample },
    validate: { name: 'Validate Token', fn: runValidateTokenExample },
  };

  console.log(
    `Welcome to the example of @jom/base-json-web-token@${PKGJSON_INFO.version}`
  );

  const setupQuestions: DistinctQuestion[] = [
    {
      type: 'list',
      name: 'exampleSecret',
      message: 'Will you be using a secret for signing/verifying tokens:',
      choices: [
        { name: 'No, tokens will not be signed', value: 'no' },
        { name: 'Custom Secret', value: 'custom' },
        ...BASE_JWT_SECRET_TYPES.map((type) => ({
          name: KEY_ALG_MESSAGES[type] || type,
          value: type,
        })),
      ],
      default: 'no',
      filter: (value: string) =>
        value !== 'no'
          ? {
              type: value.includes('.') ? value.split('.')[0] : value,
              alg: value.includes('.') ? value.split('.')[1] : undefined,
              value: SAMPLE_SECRETS[value],
            }
          : undefined,
    },
    {
      when: (answers) => answers?.exampleSecret?.type === 'custom',
      type: 'password',
      name: 'customSecret',
      message:
        'Enter your custom secret (Length matters, see algorithm constraints in secret https://github.com/panva/jose/issues/210#jws-alg):',
    },
    {
      type: 'list',
      name: 'feature',
      message: 'Which feature of BaseJsonWebToken would you like to demo?',
      choices: Object.keys(features).map((feat) => ({
        name: features[feat].name,
        value: feat,
      })),
    },
  ];

  const { feature, exampleSecret, customSecret } = await inquirer.prompt(
    setupQuestions
  );

  if (exampleSecret?.type === 'custom') {
    exampleSecret.value = customSecret;
  }

  const secretSource = exampleSecret ? exampleSecret.value : undefined;
  const secretConfig: BaseJsonWebTokenSecretOptions | undefined = exampleSecret
    ? {
        sourceFormat:
          exampleSecret.type === 'text' || exampleSecret.type === 'custom'
            ? 'raw'
            : exampleSecret.type,
        alg: exampleSecret.alg,
      }
    : undefined;

  const jwtConfig = {
    secretConfig,
    secretSource,
  };

  const jwt = new BaseJsonWebToken(jwtConfig);

  const featConfig = {
    jwt,
    isSigning: !!exampleSecret,
  } as ExampleFeatureConfig;

  features[feature].fn(featConfig);
}

runExampleCli();
