import { Hasher } from '../../data/protocols/crypto/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }
}
