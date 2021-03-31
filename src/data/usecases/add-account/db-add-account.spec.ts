import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'
import { Hasher } from '../../protocols/crypto/hasher'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }

  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve({ ...account, id: '' })
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const hasherStub = new HasherStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount', () => {
  it('should call Hasher with password', async () => {
    const { sut,hasherStub } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(accountFake)

    expect(hashSpy).toHaveBeenCalledWith(accountFake.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }

    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())

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
