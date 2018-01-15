import {IsFQDN} from 'class-validator';

export class FQDNHost {
  @IsFQDN()
  host: string;

  constructor(host: string) {
    this.host = host;
  }
}
