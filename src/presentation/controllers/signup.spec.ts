import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { badRequest } from '../helpers/http-helper'
import { Validation } from '../helpers/validators/validation'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({
        id: 'any_id',
        ...account
      })
    }
  }

  const addAccountStub = new AddAccountStub()

  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  const validationStub = new ValidationStub()

  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: '654654',
        passwordConfirmation: '654654'
      }
    }

    const errorMock = new Error('mock')

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(errorMock)
  })

  it('should call AddAccount correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'any@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should return 200 on AddAccount success', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_any@mail.com',
        password: 'valid_pwd',
        passwordConfirmation: 'valid_pwd'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body).toEqual({
      id: expect.any(String),
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_any@mail.com',
        password: 'valid_pwd',
        passwordConfirmation: 'valid_pwd'
      }
    }

    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = {
      body: {}
    }

    const errorMock = new Error('generic error!')

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(errorMock)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(errorMock))
  })
})
