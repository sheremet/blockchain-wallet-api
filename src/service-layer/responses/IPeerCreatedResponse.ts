import {ICreatedResponse} from './ICreatedResponse';

export interface IPeerCreatedResponseDataObj {
  hash: string;
  address: string;
}

export interface IPeerCreatedResponse extends ICreatedResponse {
  data: IPeerCreatedResponseDataObj;
}
