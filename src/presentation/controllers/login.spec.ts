import { AuthCredentials, Authenticator } from '../../domain/usecases/authenticator'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticatorStub: Authenticator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  class AuthenticatorStub implements Authenticator {
    async auth (credentials: AuthCredentials): Promise<string> {
      return 'valid_token'
    }
  }

  const authenticatorStub = new AuthenticatorStub()

  const sut = new LoginController(emailValidatorStub, authenticatorStub)

  return {
    sut,
    emailValidatorStub,
    authenticatorStub
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

  it('should call Authenticator with email and password, then return user token', async () => {
    const { sut, authenticatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password',
        email: 'valid@email.com'
      }
    }

    const tokenMock = 'tokenMock'
    const authSpy = jest.spyOn(authenticatorStub, 'auth').mockResolvedValueOnce(tokenMock)

    const httpResponse = await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
    expect(httpResponse.body).toEqual(tokenMock)
  })
})
