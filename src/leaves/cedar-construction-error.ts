export class CedarConstructionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CedarConstructionError';
  }
}
