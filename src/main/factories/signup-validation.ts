import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const signUpValidation = new ValidationComposite([
    new RequiredFieldsValidation(['name', 'email', 'password'])
  ])

  return signUpValidation
}
