export class DependencyInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DependencyInitializationError';
  }
}
