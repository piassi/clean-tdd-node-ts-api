import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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
})
