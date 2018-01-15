import {IsEmail, Length, IsAlphanumeric, IsAlpha} from 'class-validator';

export class UserValidationSchema {

  @Length(5, 16)
  @IsAlphanumeric()
  username: string;

  @Length(6, 24)
  password: string;

  @Length(2, 24)
  @IsAlpha()
  firstname: string;

  @Length(2, 24)
  @IsAlpha()
  lastname: string;

  @IsEmail()
  email: string;

  constructor(userInfo: any) {
    this.username = userInfo.username;
    this.password = userInfo.password;
    this.firstname = userInfo.firstname;
    this.lastname = userInfo.lastname;
    this.email = userInfo.email;
  }
}
