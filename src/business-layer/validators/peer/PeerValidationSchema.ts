import {IsNumber, IsNotEmpty, Min, Max} from 'class-validator';
import {IPeer} from '../../peer';

export class PeerValidationSchema implements IPeer {

  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(80)
  @Max(19999)
  port: number;

  protocol?: string;

  constructor(address: IPeer) {
    this.host = address.host;
    this.port = address.port;
    this.protocol = address.protocol || 'http';
  }
}
