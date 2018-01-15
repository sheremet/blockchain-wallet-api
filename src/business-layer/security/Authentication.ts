import * as express from 'express';
import {UserDataAgent} from '../../data-layer/data-agents/UserDataAgent';
import {IUserDocument} from '../../data-layer/data-abstracts/repositories/user';
import {verifyToken} from './token-helpers';
import {logger} from '../../middleware/common/logging';

const authService = new UserDataAgent();

async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  const token: any = request.headers['x-access-token'];
  if (token) {
    const payload = verifyToken(token);
    logger.info('verifyToken:payload', payload);

    if (!(payload instanceof Error)) {
      const authResult = await authService.getUserById(payload.userId);
      if (authResult && !(authResult instanceof Error)) {
        // uneccessary check... but could be used to refresh token
        const userModel = authResult as IUserDocument;
        if (userModel.id === payload.userId) {
          return Promise.resolve({authorizedUser: true});
        } else {
          return Promise.reject({
            thrown: true,
            status: 401,
            message: 'jwt token user cannot be verified BIG TROUBLE'
          });
        }
      } else {
        return Promise.reject({
          thrown: true,
          status: 401,
          message: 'jwt token user cannot be verified'
        });
      }
    } else {

      return Promise.reject({
        thrown: true,
        status: 401,
        message: payload.message.toString()
      });
    }
  } else {
    return Promise.reject({
      thrown: true,
      status: 401,
      message: 'JWT token malformed, please Authorize!'
    });
  }
}

export {expressAuthentication};
