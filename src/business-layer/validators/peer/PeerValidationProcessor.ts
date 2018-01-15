import {validateSync, ValidationError} from 'class-validator';
import {PeerValidationSchema} from './PeerValidationSchema';
import {IPeerSchema} from '../../peer';
import {hostValidation, prepareValidationErrors, protocolValidation} from '../custom';

const validatePeer = (address: IPeerSchema) => {
  const peerReqObj = new PeerValidationSchema(address);
  const validationResults: ValidationError[] = validateSync(peerReqObj);
  const constraintsArr = [];
  if (peerReqObj.hasOwnProperty('host') && peerReqObj.host) {
    hostValidation(peerReqObj.host, constraintsArr);
  }
  protocolValidation(peerReqObj.protocol, constraintsArr);
  prepareValidationErrors(validationResults, constraintsArr);
  return constraintsArr;
};

export {validatePeer};
