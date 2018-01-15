import {Length, IsHexadecimal, Min} from 'class-validator';
import {ISendMoney} from '../../wallet';

export class SendCoinsValidationSchema implements ISendMoney {

  @Length(32)
  @IsHexadecimal()
  senderWalletId: string;

  @Length(32)
  @IsHexadecimal()
  receiverWalletId: string;

  @Min(1)
  amount: number;

  constructor(payment: ISendMoney) {
    this.senderWalletId = payment.senderWalletId;
    this.receiverWalletId = payment.receiverWalletId;
    this.amount = payment.amount;
  }
}
