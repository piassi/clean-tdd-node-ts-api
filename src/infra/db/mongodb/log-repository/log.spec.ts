import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let logsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    logsCollection = await MongoHelper.getCollection('logs')
    await logsCollection.deleteMany({})
  })

  it('should insert log into collection', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_stack')
    expect(await logsCollection.countDocuments()).toBe(1)
  })
})
