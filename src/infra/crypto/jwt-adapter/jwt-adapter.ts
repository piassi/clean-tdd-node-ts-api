import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/crypto/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return Promise.resolve(jwt.sign(value, this.secret))
  }
}
