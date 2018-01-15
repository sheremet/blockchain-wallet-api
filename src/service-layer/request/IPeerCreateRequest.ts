import {IPeer} from '../../business-layer/peer';

export interface IPeerCreateRequest extends IPeer {
  host: string;
  port: number;
  protocol?: string;
}
