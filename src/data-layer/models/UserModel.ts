import {IUserDocument} from '../data-abstracts/repositories/user';

export class UserModel {

  private useModel: IUserDocument;

  constructor(iUserDocument: IUserDocument) {
    this.useModel = iUserDocument;
  }

  get id(): string {
    return (this.useModel.id).toString();
  }

  get username(): string {
    return this.useModel.username;
  }

  get password(): string {
    return this.useModel.password;
  }

  get firstname(): string {
    return this.useModel.firstname;
  }

  get lastnanme(): string {
    return this.useModel.lastname;
  }

  get email(): string {
    return this.useModel.email;
  }

  get admin(): boolean {
    return this.useModel.admin;
  }

  get isLoggedIn(): boolean {
    return this.useModel.isLoggedIn;
  }

  get createdAt(): Date {
    return this.useModel.createdAt;
  }

  get modifiedAt(): Date {
    return this.useModel.modifiedAt;
  }

  getOwnerUserModel() {
    return Object.seal({
      id: (this.useModel.id).toString(),
      username: this.useModel.username,
      firstname: this.useModel.firstname,
      lastname: this.useModel.lastname,
      email: this.useModel.email,
      createdAt: this.useModel.createdAt,
      modifiedAt: this.useModel.modifiedAt
    });
  }

  getClientUserModel() {
    return Object.seal({
      id: (this.useModel.id).toString(),
      username: this.useModel.username,
      firstname: this.useModel.firstname,
      lastname: this.useModel.lastname
    });
  }

  getAdminUserModel() {
    return Object.seal({
      id: (this.useModel.id).toString(),
      username: this.useModel.username,
      password: this.useModel.password,
      firstname: this.useModel.firstname,
      lastname: this.useModel.lastname,
      email: this.useModel.email,
      admin: this.useModel.admin,
      isLoggedIn: this.useModel.isLoggedIn,
      createdAt: this.useModel.createdAt,
      modifiedAt: this.useModel.modifiedAt
    });

  }

}
