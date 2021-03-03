import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const password = await this.encrypter.encrypt(account.password)

    const newAccountData = {
      ...account,
      password
    }

    return this.addAccountRepository.add(newAccountData)
  }
}
