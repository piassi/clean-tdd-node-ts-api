import { InvalidParamError } from '../../../errors'
import { Validation } from '../validation'

export class RequiredFieldsValidation implements Validation {
  constructor (private readonly fieldNames: string[]) {}

  validate (input: any): Error {
    for (const fieldName of this.fieldNames) {
      if (!input[fieldName]) {
        return new InvalidParamError(fieldName)
      }
    }

    return null
  }
}
