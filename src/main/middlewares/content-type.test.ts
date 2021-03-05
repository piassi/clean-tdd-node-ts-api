import request from 'supertest'
import app from '../config/app'

describe('Content type', () => {
  it('should return default content type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })
})
