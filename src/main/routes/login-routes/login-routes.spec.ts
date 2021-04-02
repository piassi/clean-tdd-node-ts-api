import { Collection } from 'mongodb'
import request from 'supertest'
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter/bcrypt-adapter'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

let accountsCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  accountsCollection = await MongoHelper.getCollection('accounts')
  await accountsCollection.deleteMany({})
})

describe('Login Routes', () => {
  describe('/login', () => {
    it('should return 200 status with JWT on success', async () => {
      const hasher = new BcryptAdapter(12)
      const password = await hasher.hash('756adasd')

      await accountsCollection.insertOne({
        name: 'Test',
        email: 'email@email.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'email@email.com',
          password: '756adasd'
        })
        .expect(200)
        .expect('Content-Length', '99')
    })

    it('should return 401 status if invalid credentials are provided', async () => {
      const hasher = new BcryptAdapter(12)
      const password = await hasher.hash('756adasd')

      await accountsCollection.insertOne({
        name: 'Test',
        email: 'email@email.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'emaila@email.com',
          password: 'asd'
        })
        .expect(401)
    })

    it('should return 401 status if user does not exists', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@email.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
