import { Authenticator } from '../../domain/usecases/authenticator'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: Authenticator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      if (!body.email) {
        return badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      if (!body.password) {
        return badRequest(new MissingParamError('password'))
      }

      const { email, password } = body

      const authToken = await this.authenticator.auth({
        email,
        password
      })

      return {
        body: authToken,
        statusCode: 200
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
