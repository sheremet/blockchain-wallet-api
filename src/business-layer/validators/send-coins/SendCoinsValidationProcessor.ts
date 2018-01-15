import {validateSync, ValidationError} from 'class-validator';
import {SendCoinsValidationSchema} from './SendCoinsValidationSchema';
import {ISendMoney} from '../../wallet';
import {prepareValidationErrors} from '../custom';

const validatePayment = (payment: ISendMoney) => {
  const walletReqObj = new SendCoinsValidationSchema(payment);
  const validationResults: ValidationError[] = validateSync(walletReqObj);
  const constraintsArr = [];
  prepareValidationErrors(validationResults, constraintsArr);
  return constraintsArr;
};

export {validatePayment};
