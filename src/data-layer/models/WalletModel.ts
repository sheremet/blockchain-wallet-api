import {IWalletDocument} from '../data-abstracts/repositories/wallet';
import * as Bcrypt from 'bcrypt-nodejs';

export class WalletModel {

  private useModel: IWalletDocument;

  constructor(iWalletDocument: IWalletDocument) {
    this.useModel = iWalletDocument;
  }

  get walletId(): string {
    return this.useModel.wallet.walletId;
  }

  get label(): string {
    return this.useModel.wallet.label;
  }

  getOwnerWalletModel() {
    return Object.seal({
      label: this.useModel.wallet.label,
      walletId: this.useModel.wallet.walletId,
      address: this.useModel.wallet.address
    });
  }

  getClientWalletModel() {
    return Object.seal({
      label: this.useModel.wallet.label,
      walletId: this.useModel.wallet.walletId
    });
  }

  getAuthorId() {
    return this.useModel.wallet.userId;
  }

  matchPassword(candidatePassword: string): boolean {
    return Bcrypt.compareSync(candidatePassword, this.useModel.wallet.password);
  }
}
