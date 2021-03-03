import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount', () => {
  it('should call Encrypter with password', async () => {
    const { sut,encrypterStub } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountFake)

    expect(encrypterSpy).toHaveBeenCalledWith(accountFake.password)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut,encrypterStub } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }

    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const account = sut.add(accountFake)

    await expect(account).rejects.toThrow()
  })
})
