import {IsIP} from 'class-validator';

export class IpHost {
  @IsIP('4')
  host: string;

  constructor(host: string) {
    this.host = host;
  }
}
