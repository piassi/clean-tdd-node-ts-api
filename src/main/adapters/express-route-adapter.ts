import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols'

export const expressAdaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const { body } = req

    const httpResponse = await controller.handle({
      body
    })

    return res
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
  }
}
