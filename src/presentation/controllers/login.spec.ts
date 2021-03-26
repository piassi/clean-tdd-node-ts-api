import { AuthCredentials, Authenticator } from '../../domain/usecases/authenticator'
import { badRequest, unauthorized } from '../helpers/http-helper'
import { Validation } from '../helpers/validators/validation'
import { HttpRequest } from '../protocols'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authenticator
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  class AuthenticatorStub implements Authenticator {
    async auth (credentials: AuthCredentials): Promise<string> {
      return 'valid_token'
    }
  }

  const authenticatorStub = new AuthenticatorStub()

  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  const validationStub = new ValidationStub()

  const sut = new LoginController(authenticatorStub, validationStub)

  return {
    sut,
    authenticatorStub,
    validationStub
  }
}

describe('Login Controller', () => {
  it('should return badRequest if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest: HttpRequest = {
      body: {}
    }
    const errorMock = new Error('mock')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(errorMock))
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
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: tokenMock
    })
  })

  it('should return 401 if invalid user credentials is provided', async () => {
    const { sut, authenticatorStub } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        password: 'valid_password',
        email: 'valid@email.com'
      }
    }

    jest.spyOn(authenticatorStub, 'auth').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
})
