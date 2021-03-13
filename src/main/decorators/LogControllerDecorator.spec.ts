import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  httpResponseMock: HttpResponse
}

const makeSut = (): SutTypes => {
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

  return {
    sut,
    controllerStub,
    httpResponseMock
  }
}

describe('LogControllerDecorator', () => {
  it('should call injected controller handle method and foward response', async () => {
    const { sut, controllerStub, httpResponseMock } = makeSut()
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
