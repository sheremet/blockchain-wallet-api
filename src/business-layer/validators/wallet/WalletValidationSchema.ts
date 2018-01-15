import {Length, IsAlphanumeric} from 'class-validator';
import {IWallet} from '../../wallet';

export class WalletValidationSchema implements IWallet {

  @Length(10, 32)
  password: string;

  @Length(2, 24)
  @IsAlphanumeric()
  label: string;

  priv?: string;

  constructor(wallet: any) {
    this.password = wallet.password;
    this.label = wallet.label;
    this.priv = wallet.priv;
  }
}
