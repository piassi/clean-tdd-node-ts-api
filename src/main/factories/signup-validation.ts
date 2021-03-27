import { EmailValidation } from '../../presentation/helpers/validators/email-validation/email-validation'
import { EqualFieldsValidation } from '../../presentation/helpers/validators/equal-fields-validation/equal-fields-validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation/required-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const signUpValidation = new ValidationComposite([
    new RequiredFieldsValidation(['name', 'email', 'password']),
    new EqualFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email')
  ])

  return signUpValidation
}
