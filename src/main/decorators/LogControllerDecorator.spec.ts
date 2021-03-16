import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  httpResponseMock: HttpResponse
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const httpResponseMock = {
    body: {
      message: 'success'
    },
    statusCode: 200
  }

  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {}
  }

  const logErrorRepositoryStub = new LogErrorRepositoryStub()

  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(httpResponseMock)
    }
  }

  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    httpResponseMock,
    logErrorRepositoryStub
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

  it('should call logErrorRepository with error stack', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const errorMock = new Error('Error')
    errorMock.stack = 'error_stack'
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(errorMock))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const requestMock = {
      body: {
        test: 'Mock'
      }
    }

    await sut.handle(requestMock)
    expect(logSpy).toHaveBeenCalledWith(errorMock.stack)
  })
})
