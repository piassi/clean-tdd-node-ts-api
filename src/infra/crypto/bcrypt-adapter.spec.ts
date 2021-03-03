import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: Encrypter
  salt: number
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return {
    sut,
    salt
  }
}

describe('Bcrypt adapter', () => {
  it('should call bcrypt lib with correct arguments', async () => {
    const { sut, salt } = makeSut()
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')
    const value = 'any_value'
    await sut.encrypt(value)
    expect(bcryptHashSpy).toHaveBeenCalledWith(value, salt)
  })

  it('should return a hash on success', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_value')
    const value = 'any_value'
    const hashed = await sut.encrypt(value)
    expect(hashed).toEqual('hashed_value')
  })
})
