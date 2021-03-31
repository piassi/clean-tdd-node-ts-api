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

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('add', () => {
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

  describe('loadByEmail', () => {
    it('should return an account on success', async () => {
      const sut = makeSut()
      const accountFakeData = {
        name: 'name',
        email: 'email@email.com',
        password: '123'
      }

      await sut.add(accountFakeData)
      const account = await sut.loadByEmail(accountFakeData.email)

      expect(account).toEqual({
        id: expect.any(String),
        ...accountFakeData
      })
    })

    it('should return null if account do not exists', async () => {
      const sut = makeSut()
      const accountFakeData = {
        name: 'name',
        email: 'email@email.com',
        password: '123'
      }

      const account = await sut.loadByEmail(accountFakeData.email)

      expect(account).toBe(null)
    })
  })
})
