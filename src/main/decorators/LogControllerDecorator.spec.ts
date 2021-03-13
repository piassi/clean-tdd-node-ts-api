import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

describe('LogControllerDecorator', () => {
  it('should call injected controller handle method and foward response', async () => {
    const httpResponseMock = {
      body: {
        message: 'success'
      },
      statusCode: 200
    }

    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve(httpResponseMock)
      }
    }

    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const controllerStubHandleSpy = jest.spyOn(controllerStub, 'handle')
    const requestMock = {
      body: {
        test: 'Mock'
      }
    }

    const httpResponse = await sut.handle(requestMock)
    expect(controllerStubHandleSpy).toHaveBeenCalledWith(requestMock)
    expect(httpResponse).toEqual(httpResponseMock)
  })
})
