import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!body.password) {
      return badRequest(new MissingParamError('password'))
    }

    return Promise.resolve(null)
  }
}
