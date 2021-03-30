import { AuthCredentials, Authenticator } from '../../../domain/usecases/authenticator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticator implements Authenticator {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (credentials: AuthCredentials): Promise<string> {
    const user = await this.loadAccountByEmailRepository.load(credentials.email)

    if (!user) {
      return null
    }

    return null
  }
}
