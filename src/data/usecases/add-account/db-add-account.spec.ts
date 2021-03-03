import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({ ...account, id: '' })
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  it('should call AddAccountRepository with account data', async () => {
    const { sut,addAccountRepositoryStub } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountFake)

    expect(addSpy).toHaveBeenCalledWith({ ...accountFake, password: 'hashed_password' })
  })

  it('should call return AccountModel on success', async () => {
    const { sut } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }

    const account = await sut.add(accountFake)

    expect(account).toEqual({
      ...account,
      id: expect.any(String)
    })
  })
})
