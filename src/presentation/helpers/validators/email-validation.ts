import { InvalidParamError } from '../../errors'
import { Validation } from './validation'
import validator from 'validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: any): Error {
    if (!validator.isEmail(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
