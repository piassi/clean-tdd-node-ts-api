import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  it('should return badRequest if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return badRequest if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'invalidemail',
        password: 'valid_password'
      }
    }

    const validateSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body.email)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return badRequest if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'valid@email.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return serverError in case of throw', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password',
        email: 'valid@email.com'
      }
    }

    const errorMock = new Error('Mock!')

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw errorMock })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(errorMock))
  })
})
