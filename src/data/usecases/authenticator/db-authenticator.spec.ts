import { AccountModel } from '../../../domain/models/account'
import { AuthCredentials } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthenticator } from './db-authenticator'

describe('DbAuthenticator', () => {
  type SutTypes = {
    sut: DbAuthenticator
    credentialsMock: AuthCredentials
    dbAccountMock: AccountModel
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
  }

  const makeSut = (): SutTypes => {
    const dbAccountMock: AccountModel = {
      email: 'valid@email.com',
      id: '1',
      name: 'Valid',
      password: 'hashed_pwd'
    }

    const credentialsMock: AuthCredentials = {
      email: 'user@email.com',
      password: 'userpass123'
    }

    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return Promise.resolve(dbAccountMock)
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    class HashComparerStub implements HashComparer {
      async compare (value: string, hash: string): Promise<boolean> {
        return Promise.resolve(true)
      }
    }
    const hashComparerStub = new HashComparerStub()

    const sut = new DbAuthenticator(loadAccountByEmailRepositoryStub, hashComparerStub)

    return {
      sut,
      credentialsMock,
      dbAccountMock,
      loadAccountByEmailRepositoryStub,
      hashComparerStub
    }
  }

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, credentialsMock, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(credentialsMock)

    expect(loadSpy).toHaveBeenCalledWith(credentialsMock.email)
  })

  it('should call return null if LoadAccountByEmailRepository user does not exists', async () => {
    const { sut, credentialsMock, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(credentialsMock)

    expect(accessToken).toBe(null)
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, credentialsMock, dbAccountMock, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(credentialsMock)

    expect(compareSpy).toHaveBeenCalledWith(credentialsMock.password, dbAccountMock.password)
  })
})
