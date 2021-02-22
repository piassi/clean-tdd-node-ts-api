export class SignUpController {
  handle (httpRequest: any): any {
    const { body } = httpRequest

    if (!body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
