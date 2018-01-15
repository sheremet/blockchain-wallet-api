import {validate, ValidationError} from 'class-validator';
import {UserValidationSchema} from './UserValidationSchema';
import {passwordValidation, prepareValidationErrors} from '../custom';

async function validateUserRegistration(userReqObj: any): Promise<any> {
  const validUserRegData = new UserValidationSchema(userReqObj);
  const validationResults: ValidationError[] = await validate(validUserRegData);
  const constraintsArr = [];
  passwordValidation(userReqObj.password, constraintsArr);
  prepareValidationErrors(validationResults, constraintsArr);
  return constraintsArr;
}

export {validateUserRegistration};
