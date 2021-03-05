import request from 'supertest'
import app from '../config/app'

describe('Body parser', () => {
  it('should parse body as json object', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Test' })
      .expect({ name: 'Test' })
  })
})
