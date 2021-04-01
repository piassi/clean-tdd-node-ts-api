import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../../config/app'

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

describe('Signup Routes', () => {
  describe('/signup', () => {
    it('should return an account on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'email@email.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })

    it('should return 200 if no name is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          password: '123',
          email: 'email@email.com',
          passwordConfirmation: '123'
        })
        .expect(400)
    })

    it('should return 200 if no password is provided or passwordConfirmation is not valid', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'email@email.com',
          passwordConfirmation: '123'
        })
        .expect(400)

      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'email@email.com',
          password: '123'
        })
        .expect(400)

      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'email@email.com',
          password: '123',
          passwordConfirmation: ''
        })
        .expect(400)
    })

    it('should return 400 if no/invalid email is provided', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(400)

      await request(app)
        .post('/api/signup')
        .send({
          name: 'Valid Name',
          email: 'invalid_email',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(400)
    })
  })
})
