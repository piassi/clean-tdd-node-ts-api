import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
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
  describe('hash', () => {
    it('should call bcrypt hash with correct arguments', async () => {
      const { sut, salt } = makeSut()
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')
      const value = 'any_value'
      await sut.hash(value)
      expect(bcryptHashSpy).toHaveBeenCalledWith(value, salt)
    })

    it('should return a hash on success', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed_value')
      const value = 'any_value'
      const hashed = await sut.hash(value)
      expect(hashed).toEqual('hashed_value')
    })
  })

  describe('compare', () => {
    it('should call bcrypt compare with correct arguments', async () => {
      const { sut } = makeSut()
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare')
      const value = 'any_value'
      const hash = 'any_hash'
      await sut.compare(value, hash)
      expect(bcryptCompareSpy).toHaveBeenCalledWith(value, hash)
    })
  })

  it('should not handle exceptions', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
    const value = 'any_value'
    const hashed = sut.hash(value)
    await expect(hashed).rejects.toThrow()
  })
})
