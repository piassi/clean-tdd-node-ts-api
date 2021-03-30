import { AuthCredentials, Authenticator } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { TokenGenerator } from '../../protocols/crypto/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (credentials: AuthCredentials): Promise<string> {
    const user = await this.loadAccountByEmailRepository.load(credentials.email)
    if (!user) {
      return null
    }

    const isEqual = await this.hashComparer.compare(credentials.password, user.password)
    if (!isEqual) {
      return null
    }

    return await this.tokenGenerator.generate(user.id)
  }
}
