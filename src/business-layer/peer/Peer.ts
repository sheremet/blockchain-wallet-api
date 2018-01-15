import {IPeer} from './IPeer';
import {getHash} from '../../shared/helper';

export class Peer {

  static createHashFromAddress(address: IPeer): string {
    const addressStr = this.getAddressStr(address);
    return getHash(addressStr);
  }

  static getAddressStr(address: IPeer) {
    return `${address.protocol || 'http'}://${address.host}:${address.port}`;
  }
}
