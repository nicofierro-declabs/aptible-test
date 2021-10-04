import { Request, Response } from 'express'
import db from '../config/db/knex'

  /**
   * healthCheck
   * @param req Not used.
   * @param res Express js Response object
   * @returns Status of the api and db connection. If it's all ok it returns a 200 code. 
   */
export const healthCheck = async (req: Request, res: Response) => {
  try {
    await db.raw('select 1 + 1 as result');
    return res.status(200).json({ status: 'healthy' })
  } catch (err) {
    throw new Error('[utils/healthCheck.healthCheck] Health check error')
  }
}
