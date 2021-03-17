import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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

    return Promise.resolve(null)
  }
}
