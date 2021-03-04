import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountToInsert = { ...accountData }
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountToInsert)
    const {
      _id,
      ...insertedAccountData
    } = result.ops[0]

    return {
      ...insertedAccountData,
      id: _id.toString()
    }
  }
}
