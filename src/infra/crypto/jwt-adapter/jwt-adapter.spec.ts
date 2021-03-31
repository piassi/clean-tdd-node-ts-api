import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JwtAdapter', () => {
  it('should call jwt method with correct values', async () => {
    const valueMock = 'any_value'
    const secretMock = 'any_secret'

    const sut = new JwtAdapter(secretMock)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt(valueMock)

    expect(signSpy).toHaveBeenCalledWith(valueMock, secretMock)
  })
})
