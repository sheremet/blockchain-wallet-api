import mongoose = require('mongoose');
import {UserRepo, UserSchema, IUserDocument} from '../data-abstracts/repositories/user';
import {logger} from '../../middleware/common/logging';

export class UserDataAgent {

  async createNewUser(user: any): Promise<any> {

    const newUser = (user) as IUserDocument;
    const previousUser = await UserRepo.findOne({username: newUser.username});
    if (previousUser) {
      return {thrown: true, success: false, status: 409, message: 'username is already in use'};
    }
    newUser.isLoggedIn = true;
    const newUserResult = await UserRepo.create(newUser);
    if (newUserResult.errors) {
      return {thrown: true, success: false, status: 422, message: 'db is currently unable to process request'};
    }
    return newUserResult;
  }

  async getAuthorizedUser(auth: any): Promise<any> {
    const authorizedUserResult = await UserRepo.findOne({username: auth.username});
    if (!authorizedUserResult) {
      return {thrown: true, success: false, status: 401, message: 'no username ' + auth.username + ' currently exist'};
    }
    const passwordsMatch = await UserSchema.methods.comparePassword(auth.password, authorizedUserResult);
    if (!passwordsMatch) {
      return {thrown: true, success: false, status: 401, message: 'username or password is incorrect'};

    }
    const userProfile = authorizedUserResult as IUserDocument;
    userProfile.isLoggedIn = true;
    const savedResult = await userProfile.save();
    if (savedResult.errors) {
      return {thrown: true, success: false, status: 422, message: 'db is currently unable to process request'};
    }
    return authorizedUserResult;
  }

  async getByUsername(userName: string): Promise<any> {
    const authUser = await UserRepo.findOne({username: userName});

    if (!authUser) {
      return {thrown: true, success: false, status: 404, message: 'username does not exit'};
    }
    return authUser;
  }

  async getUserById(userId: string): Promise<any> {
    const objectId = mongoose.Types.ObjectId;
    if (!objectId.isValid(userId)) {
      return {thrown: true, success: false, status: 401, message: 'incorrect user id'};
    }
    const result = await UserRepo.findById(userId);
    return result;
  }

  async updateUserProfile(userProfile: any): Promise<any> {
    const objectId = mongoose.Types.ObjectId;
    if (!objectId.isValid(userProfile.id)) {
      return {thrown: true, success: false, status: 401, message: 'incorrect user id'};
    }
    const resultUserById = await UserRepo.findById(userProfile.id);
    if (resultUserById) {
      return {thrown: true, success: false, status: 409, message: 'this user does not exist'};
    }
    const savedResult = await userProfile.save();
    if (savedResult.errors) {
      return {status: 422, success: false, message: 'db is currently unable to process request'};
    }

    return savedResult;

  }

  async destroy() {
    throw new Error('todo!');
  }

}
