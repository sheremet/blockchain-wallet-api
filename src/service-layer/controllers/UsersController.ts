import {Route, Response, Get, Post, Patch, Header, Body, Security, Controller, Path, Tags} from 'tsoa';

import {IUserCreateRequest, IUserUpdateRequest} from '../request';
import {IUserResponse, IErrorResponse} from '../responses';
import {validateUserRegistration} from '../../business-layer/validators/user/UserValidationProcessor';
import {createAuthToken} from '../../business-layer/security/token-helpers';

import {UserDataAgent} from '../../data-layer/data-agents/UserDataAgent';
import {UserModel} from '../../data-layer/models/UserModel';

import {logger} from '../../middleware/common/logging';
import {validationErrorsFormatter} from '../../shared/validationErrorsFormatter';

@Route('users')
export class UsersController extends Controller {

  userDataAgent: UserDataAgent = new UserDataAgent();

  @Post('signup')
  @Tags('Users')
  public async RegisterNewUser(@Body()  request: IUserCreateRequest): Promise<IUserResponse> {
    const validationErrors: any[] = await validateUserRegistration(request);
    logger.info('RegisterNewUser  validationErrors =', validationErrors);
    if (validationErrors.length > 0) {
      throw {
        thrown: true,
        status: 401,
        success: false,
        message: 'Incorrect input data',
        errors: validationErrorsFormatter(validationErrors)
      };
    }
    const result = await this.userDataAgent.createNewUser(request);
    if (result.id) {
      const newUser = new UserModel(result);
      const loginResult = {
        account: {
          user: newUser.getClientUserModel(),
          token: createAuthToken(result.id)
        }
      };
      return (loginResult) as IUserResponse;
    } else {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: result.message.toString() || 'Internal server error'
      };
    }
  }

  @Security('api_key')
  @Get('{userId}')
  @Tags('Users')
  public async GetUserById(userId: string
                           //                      , @Header('x-access-token') authentication: string
  ): Promise<IUserResponse> {
    const result = await this.userDataAgent.getUserById(userId);
    if (result && result.username) {
      const aUser = new UserModel(result);
      return (aUser.getClientUserModel()) as IUserResponse;
    } else {
      if (result) {
        throw {
          thrown: true,
          success: false,
          status: 401,
          message: result.message.toString()
        };
      } else {
        throw {
          thrown: true,
          success: false,
          status: 404,
          message: 'no such user exist'
        };
      }
    }
  }

  @Response<IErrorResponse>('404', 'no such user exist')
  @Get('username/{username}')
  @Tags('Users')
  public async GetUserByUsername(@Path() username: string): Promise<IUserResponse> {
    const result = await this.userDataAgent.getByUsername(username);
    if (result && result.username) {
      const aUser = new UserModel(result);
      return aUser.getClientUserModel() as IUserResponse;
    } else {
      throw result;
    }
  }

  @Security('api_key')
  @Patch()
  @Tags('Users')
  public async Update(@Body() request: IUserUpdateRequest): Promise<IUserResponse> {
    const result = await this.userDataAgent.updateUserProfile(request);
    if (result.id) {
      const aUser = new UserModel(result);
      return (aUser.getClientUserModel()) as IUserResponse;
    } else {
      throw result;
    }
  }

}
