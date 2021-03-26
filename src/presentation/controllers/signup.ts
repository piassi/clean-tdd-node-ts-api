import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../protocols'
import { AddAccount } from '../../domain/usecases/add-account'
import { Validation } from '../helpers/validators/validation'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return {
        body: account,
        statusCode: 200
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
