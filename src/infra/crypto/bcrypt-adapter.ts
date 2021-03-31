import { Hasher } from '../../data/protocols/crypto/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/crypto/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
