import { DbAuthenticator } from '../../../data/usecases/authenticator/db-authenticator'
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/crypto/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LoginController } from '../../../presentation/controllers/login'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation/required-fields-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

export const makeLoginController = (): LoginController => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter('secret')
  const dbAuthenticator = new DbAuthenticator(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validation = new ValidationComposite([
    new RequiredFieldsValidation(['email', 'password'])
  ])
  return new LoginController(dbAuthenticator, validation)
}
