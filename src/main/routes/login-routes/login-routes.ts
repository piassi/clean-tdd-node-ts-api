import { Router } from 'express'
import { expressAdaptRoute } from '../../adapters/express-route-adapter'
import { makeLoginController } from '../../factories/login/login'

export default (router: Router): void => {
  router.post('/login', expressAdaptRoute(makeLoginController()))
}
