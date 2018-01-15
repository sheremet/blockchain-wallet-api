import {IPeerDocument} from '../data-abstracts/repositories/peers';
import {Peer} from '../../business-layer/peer';

export class PeerModel {

  private useModel: IPeerDocument;

  constructor(iPeerDocument: IPeerDocument) {
    this.useModel = iPeerDocument;
  }

  get host(): string {
    return this.useModel.address.host;
  }

  get port(): number {
    return this.useModel.address.port;
  }

  get protocol(): string {
    return this.useModel.address.protocol;
  }

  getPeerModel() {
    return Object.seal({
      host: this.useModel.address.host,
      port: this.useModel.address.port,
      protocol: this.useModel.address.protocol
    });
  }

  getFullAddress(): string {
    return Peer.getAddressStr(this.useModel.address);
  }

}
