export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorize')
    this.name = 'UnauthorizedError'
  }
}
