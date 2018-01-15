import {validateSync, ValidationError} from 'class-validator';
import {FQDNHost, IpHost} from './libs';
import {logger} from '../../middleware/common/logging';

export const passwordValidation = (password: string, constraintsArr: any[] = []) => {
  const regex = new RegExp('^[A-Za-z0-9$]+$');
  const badPW = regex.test(password);
  if (!badPW) {
    constraintsArr.push({
      constraints: {isAlphanumeric: 'password must contain only letters and numbers and $'},
      property: 'password'
    });
  }
  return constraintsArr;
};

export const hostValidation = (host: string, constraintsArr: any[] = [], propName?: string) => {
  const isFQDNHost = new FQDNHost(host);
  const isFQDNHostValidationResults: ValidationError[] = validateSync(isFQDNHost);
  const isIpHost = new IpHost(host);
  const isIpHostValidationResults: ValidationError[] = validateSync(isIpHost);
  const isValid = !isIpHostValidationResults.length || !isFQDNHostValidationResults.length;
  if (!isValid) {
    constraintsArr.push({
      constraints: {isHost: 'host must be FQDN or IP address v4'},
      property: propName || 'host'
    });
  }
  return constraintsArr;
};

export const protocolValidation = (protocol: string, constraintsArr: any[] = [], propName?: string) => {
  const protocolValid = protocol === 'https' || protocol === 'http';
  if (!protocolValid) {
    constraintsArr.push({
      constraints: {isValidProtocol: 'Protocol must be `http` or `https`'},
      property: propName || 'protocol'
    });
  }
  return constraintsArr;
};

export const prepareValidationErrors = (validationResults: ValidationError[], constraintsArr: any[] = []) => {
  if (validationResults && validationResults.length > 0 || constraintsArr.length) {
    validationResults.map((item) => {
      const {constraints, property} = item;
      constraintsArr.push({constraints, property});
    });
  }
};
