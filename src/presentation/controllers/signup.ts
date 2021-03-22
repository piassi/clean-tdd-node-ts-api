import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { AddAccount } from '../../domain/usecases/add-account'
import { Validation } from '../helpers/validators/validation'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
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

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (body.password !== body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
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
