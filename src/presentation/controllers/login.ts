import { Authenticator } from '../../domain/usecases/authenticator'
import { badRequest, serverError, unauthorized } from '../helpers/http-helper'
import { Validation } from '../helpers/validators/validation'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authenticator: Authenticator,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = body

      const authToken = await this.authenticator.auth({
        email,
        password
      })

      if (!authToken) {
        return unauthorized()
      }

      return {
        body: authToken,
        statusCode: 200
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
