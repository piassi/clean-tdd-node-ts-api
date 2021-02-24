import { MissingParamError } from '../errors/missing-param-error'
import { HttpRequest, HttpResponse } from '../protocols/http'
import {badRequest} from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest

    if (!body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
