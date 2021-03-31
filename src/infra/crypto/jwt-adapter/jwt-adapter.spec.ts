import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JwtAdapter', () => {
  type SutTypes = {
    sut: JwtAdapter
    valueMock: string
    secretMock: string
  }

  const makeSut = (): SutTypes => {
    const valueMock = 'any_value'
    const secretMock = 'any_secret'

    const sut = new JwtAdapter(secretMock)

    return {
      sut,
      valueMock,
      secretMock
    }
  }

  describe('encrypt', () => {
    it('should call jwt sign with correct value and secret', async () => {
      const { sut, valueMock, secretMock } = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt(valueMock)

      expect(signSpy).toHaveBeenCalledWith(valueMock, secretMock)
    })

    it('should return jwt.sign result', async () => {
      const { sut, valueMock } = makeSut()
      const signResultMock = 'mocked_result'
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => signResultMock)

      const encryptResult = await sut.encrypt(valueMock)

      expect(encryptResult).toEqual(signResultMock)
    })
  })
})
