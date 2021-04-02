import { Express, Router } from 'express'
import loginRoutes from '../routes/login-routes/login-routes'
import singupRoutes from '../routes/signup-routes/singup-routes'

export default (app: Express): void => {
  const router = Router()
  const routes = [
    loginRoutes,
    singupRoutes
  ]
  app.use('/api', router)

  for (const registerRoute of routes) {
    registerRoute(router)
  }
}
