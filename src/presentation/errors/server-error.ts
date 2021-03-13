export class ServerError extends Error {
  constructor (error: Error) {
    super(`Internal server error: ${error.message}`)
    this.name = 'ServerError'
    this.stack = error.stack
  }
}
