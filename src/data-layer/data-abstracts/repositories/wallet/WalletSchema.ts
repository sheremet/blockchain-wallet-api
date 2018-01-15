import {Schema} from 'mongoose';
import {getCurrentDateTime} from '../../../../shared/helper';
import * as Bcrypt from 'bcrypt-nodejs';
import {IWalletDocument} from './IWalletDocument';

const SALT_WORK_FACTOR = 10;

const Wallet = {
  label: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  walletId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
};

const WalletSchema = new Schema({
  wallet: Wallet,
  createdAt: {
    type: Date,
    default: getCurrentDateTime()
  },
  modifiedAt: {
    type: Date,
    default: getCurrentDateTime()
  }
});

WalletSchema.pre('save', function(next: any) {
  if (this._doc) {
    const doc = this._doc as IWalletDocument;
    const now = getCurrentDateTime();

    if (!doc.createdAt) {
      doc.createdAt = now;
    }

    doc.modifiedAt = now;

    if (!this.isModified('wallet.password')) {
      return next();
    }

    doc.wallet.password = Bcrypt.hashSync(doc.wallet.password, Bcrypt.genSaltSync(SALT_WORK_FACTOR));
  }

  next();
});

export {WalletSchema};
