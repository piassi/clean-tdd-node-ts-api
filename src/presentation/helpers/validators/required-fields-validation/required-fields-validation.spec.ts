import { InvalidParamError } from '../../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

describe('Email validation', () => {
  it('should return InvalidParamError if invalid email is provided', () => {
    const fieldName = 'email'
    const sut = new RequiredFieldsValidation([fieldName])
    const error = sut.validate({
      email: ''
    })
    expect(error).toEqual(new InvalidParamError(fieldName))
  })

  it('should return null if valid email is provided', () => {
    const fieldName = 'email'
    const sut = new RequiredFieldsValidation([fieldName])
    const error = sut.validate({
      email: 'filled@email.com'
    })
    expect(error).toBe(null)
  })
})
