import {IUpdatedResponse} from './IUpdatedResponse';

export interface IPeerUpdatedResponseDataObj {
  hash: string;
  address: string;
}

export interface IPeerUpdatedResponse extends IUpdatedResponse {
  data: IPeerUpdatedResponseDataObj;
}
