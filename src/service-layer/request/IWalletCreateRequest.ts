import {IWallet} from '../../business-layer/wallet';

export interface IWalletCreateRequest extends IWallet {
  password: string;
  label: string;
}
