// This file is part of the Restify Reference Application.
export type ApiModuleArguments = {
  modulePath: string;
};

export type ApiModuleFactory = (
  config?: ApiModuleArguments
) => Promise<void> | void;
