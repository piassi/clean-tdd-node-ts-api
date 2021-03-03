import { DbAddAccount } from "./db-add-account";

describe('DbAddAccount', () => {
  it('should call Encrypter with password', async () => {
    const accountFake = {
      name: 'Valid Name',
      email: 'valid@email.com',
      password: 'valid_password'
    }

    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub)

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountFake)

    expect(encrypterSpy).toHaveBeenCalledWith(accountFake.password)
  })
})
