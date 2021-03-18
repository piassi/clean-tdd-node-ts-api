export interface AuthCredentials {
  email: string
  password: string
}

export interface Authenticator {
  auth: (credentials: AuthCredentials) => Promise<string>
}
