import mongoose = require('mongoose');
import {IWalletSchema} from '../../../../business-layer/wallet';

export interface IWalletDocument extends mongoose.Document {
  wallet: IWalletSchema;
  createdAt: Date;
  modifiedAt: Date;
}
