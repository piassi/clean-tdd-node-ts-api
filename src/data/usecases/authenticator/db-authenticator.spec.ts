import { AccountModel } from '../../../domain/models/account'
import { AuthCredentials } from '../../../domain/usecases/authenticator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthenticator } from './db-authenticator'

describe('DbAuthenticator', () => {
  type SutTypes = {
    sut: DbAuthenticator
    credentials: AuthCredentials
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return Promise.resolve({
          email: 'valid@email.com',
          id: '1',
          name: 'Valid',
          password: '123'
        })
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthenticator(loadAccountByEmailRepositoryStub)
    const credentials: AuthCredentials = {
      email: 'user@email.com',
      password: 'userpass123'
    }

    return {
      sut,
      credentials,
      loadAccountByEmailRepositoryStub
    }
  }

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, credentials, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(credentials)

    expect(loadSpy).toHaveBeenCalledWith(credentials.email)
  })
})
