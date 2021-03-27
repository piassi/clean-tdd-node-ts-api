import { InvalidParamError } from '../../../errors'

import { EqualFieldsValidation } from './equal-fields-validation'

describe('Email validation', () => {
  it('should return InvalidParamError if fields are different', () => {
    const fieldName = 'email'
    const fieldToCompare = 'emailConfirmation'
    const sut = new EqualFieldsValidation(fieldName, fieldToCompare)
    const error = sut.validate({
      email: 'email@email.com',
      emailConfirmation: 'notequal@email.com'
    })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  it('should return null if fields are equal', () => {
    const fieldName = 'email'
    const fieldToCompare = 'emailConfirmation'
    const sut = new EqualFieldsValidation(fieldName, fieldToCompare)
    const error = sut.validate({
      email: 'email@email.com',
      emailConfirmation: 'email@email.com'
    })
    expect(error).toBe(null)
  })
})
