import {Response} from 'express';

export default {
  ok: (res: Response, content?: any): Response => {
    return res.status(200).json(!content ? {status: 200, message: 'OK', success: true} : {data: content, success: true});
  },

  noContent: (res: Response, content?: any): Response => {
    return res
      .status(204)
      .json(!content ? {status: 204, message: 'OK (No Content)', success: true} : {data: content, success: true});
  },

  badRequest: (res: Response, content?: any): Response => {
    return res
      .status(400)
      .json(!content ? {status: 400, message: 'Bad Request', success: false} : {status: 400, error: content, success: false});
  },

  forbidden: (res: Response, content?: any): Response => {
    return res
      .status(403)
      .json(!content ? {status: 403, message: 'Forbidden', success: false} : {error: content, success: false});
  },

  unauthorized: (res: Response, content?: any): Response => {
    return res
      .status(401)
      .json(!content ? {status: 401, message: 'Unauthorized', success: false} : {status: 401, error: content, success: false});
  },

  notFound: (res: Response, content?: any): Response => {
    return res
      .status(404)
      .json(!content ? {status: 404, message: 'Not Found', success: false} : {status: 404, error: content, success: false});
  },

  conflict: (res: Response, content?: any): Response => {
    return res
      .status(409)
      .json(!content ? {status: 409, message: 'Conflict error', success: false} : {status: 409, error: content, success: false});
  },

  unprocessableEntity: (res: Response, error?: any, message?: string): Response => {
    return res.status(422).json({status: 422, error: error || 'Unprocessable Entity', message, success: false});
  },

  internalServerError: (res: Response, error?: Error): Response => {
    return res
      .status(500)
      .json({status: 500, message: error?.message ?? 'Internal Server Error', success: false, stack: error?.stack});
  },

  serviceUnavailable: (res: Response, content?: any): Response => {
    return res
      .status(503)
      .json(
        !content ? {status: 503, message: 'Service Temporarily Unavailable', success: false} : {error: content, success: false}
      );
  },
};
