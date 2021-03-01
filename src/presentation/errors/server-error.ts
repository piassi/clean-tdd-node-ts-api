export class ServerError extends Error {
  constructor (message: string) {
    super(`Internal server error: ${message}`)
    this.name = 'ServerError'
  }
}
