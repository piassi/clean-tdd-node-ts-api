import { InvalidParamError } from '../../../errors'
import { EmailValidation } from './email-validation'

describe('Email validation', () => {
  it('should return InvalidParamError if invalid email is provided', () => {
    const fieldName = 'email'
    const sut = new EmailValidation(fieldName)
    const error = sut.validate({
      email: 'invalid.email'
    })
    expect(error).toEqual(new InvalidParamError(fieldName))
  })
})
