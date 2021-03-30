import { AuthCredentials, Authenticator } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (credentials: AuthCredentials): Promise<string> {
    const user = await this.loadAccountByEmailRepository.load(credentials.email)

    if (!user) {
      return null
    }

    await this.hashComparer.compare(credentials.password, user.password)

    return null
  }
}
