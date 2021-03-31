import { AuthCredentials, Authenticator } from '../../../domain/usecases/authenticator'
import { HashComparer } from '../../protocols/crypto/hash-comparer'
import { Encrypter } from '../../protocols/crypto/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly ecrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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

    const accessToken = await this.ecrypter.encrypt(user.id)

    await this.updateAccessTokenRepository.update(user.id, accessToken)

    return accessToken
  }
}
