import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt adapter', () => {
  it('should call bcrypt lib with correct arguments', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')
    const value = 'any_value'
    await sut.encrypt(value)
    expect(bcryptHashSpy).toHaveBeenCalledWith(value, salt)
  })

  it('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_value')
    const value = 'any_value'
    const hashed = await sut.encrypt(value)
    expect(hashed).toEqual('hashed_value')
  })
})
