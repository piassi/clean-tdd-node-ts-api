import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/crypto/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    await jwt.sign(value, this.secret)

    return Promise.resolve('')
  }
}
