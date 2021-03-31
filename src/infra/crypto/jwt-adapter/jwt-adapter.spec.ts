import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('JwtAdapter', () => {
  it('should call jwt sign with correct value and secret', async () => {
    const valueMock = 'any_value'
    const secretMock = 'any_secret'

    const sut = new JwtAdapter(secretMock)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt(valueMock)

    expect(signSpy).toHaveBeenCalledWith(valueMock, secretMock)
  })
})
