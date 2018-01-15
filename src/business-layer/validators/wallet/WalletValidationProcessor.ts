import {validateSync, ValidationError} from 'class-validator';
import {WalletValidationSchema} from './WalletValidationSchema';
import {IWallet, IWalletSchemaUpdate} from '../../wallet';
import {passwordValidation, prepareValidationErrors} from '../custom';

const validateWallet = (walletReq: IWallet | IWalletSchemaUpdate) => {
  const walletReqObj = new WalletValidationSchema(walletReq);
  const validationResults: ValidationError[] = validateSync(walletReqObj);
  const constraintsArr = [];
  passwordValidation(walletReq.password, constraintsArr);
  prepareValidationErrors(validationResults, constraintsArr);
  return constraintsArr;
};

export {validateWallet};
