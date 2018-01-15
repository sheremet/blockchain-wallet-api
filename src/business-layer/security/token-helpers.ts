import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import {logger} from '../../middleware/common/logging';

const opts = {
  secretOrKey: config.get('auth.jwt_secret').toString()
};

function createAuthToken(userId: string): string {
  const user = {userId};
  const token = jwt.sign(user, config.get('auth.jwt_secret').toString(), {expiresIn: 60 * 60});
  logger.info('createAuthToken:token', token);
  return token;
}

function verifyToken(token: string): any {
  try {
    logger.info('opts.secretOrKey', token, opts.secretOrKey);
    return jwt.verify(token, opts.secretOrKey);
  } catch (err) {
    logger.error('verifyToken', 'Unable to access data as user cannot be verified', err);
    throw {
      thrown: true,
      success: false,
      status: 401,
      message: 'Unable to access data as user cannot be verified'
    };
  }
}

export {createAuthToken, verifyToken};
