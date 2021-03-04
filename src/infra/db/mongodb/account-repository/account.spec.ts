import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return an account on success', async () => {
    const sut = makeSut()
    const accountFakeData = {
      name: 'name',
      email: 'email@email.com',
      password: '123'
    }

    const account = await sut.add(accountFakeData)

    expect(account).toEqual({
      id: expect.any(String),
      ...accountFakeData
    })
  })
})
