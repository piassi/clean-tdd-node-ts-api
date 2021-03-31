import { AccountModel } from '../../../domain/models/account'
import { AuthCredentials } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { DbAuthenticator } from './db-authenticator'

describe('DbAuthenticator', () => {
  type SutTypes = {
    sut: DbAuthenticator
    credentialsMock: AuthCredentials
    dbAccountMock: AccountModel
    tokenMock: string
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
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

    const tokenMock = 'access_token'

    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
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

    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return Promise.resolve(tokenMock)
      }
    }
    const encrypterStub = new EncrypterStub()

    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async update (id: string, accessToken: string): Promise<void> {
        return Promise.resolve(null)
      }
    }
    const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()

    const sut = new DbAuthenticator(
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      encrypterStub,
      updateAccessTokenRepositoryStub
    )

    return {
      sut,
      credentialsMock,
      dbAccountMock,
      tokenMock,
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      encrypterStub,
      updateAccessTokenRepositoryStub
    }
  }

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, credentialsMock, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(credentialsMock)

    expect(loadSpy).toHaveBeenCalledWith(credentialsMock.email)
  })

  it('should call return null if LoadAccountByEmailRepository user does not exists', async () => {
    const { sut, credentialsMock, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(credentialsMock)

    expect(accessToken).toBe(null)
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, credentialsMock, dbAccountMock, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(credentialsMock)

    expect(compareSpy).toHaveBeenCalledWith(credentialsMock.password, dbAccountMock.password)
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, credentialsMock, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(credentialsMock)

    expect(accessToken).toBeNull()
  })

  it('should generate and return accessToken', async () => {
    const { sut, credentialsMock, dbAccountMock, tokenMock, encrypterStub } = makeSut()

    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accessToken = await sut.auth(credentialsMock)

    expect(generateSpy).toHaveBeenCalledWith(dbAccountMock.id)
    expect(accessToken).toEqual(tokenMock)
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, credentialsMock, dbAccountMock, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    const accessToken = await sut.auth(credentialsMock)

    expect(updateSpy).toHaveBeenCalledWith(dbAccountMock.id, accessToken)
  })
})
