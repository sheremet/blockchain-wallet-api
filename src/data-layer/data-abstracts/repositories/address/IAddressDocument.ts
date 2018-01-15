import mongoose = require('mongoose');
import {IAddressSchema} from '../../../../business-layer/address';

export interface IAddressDocument extends mongoose.Document {
  address: IAddressSchema;
  createdAt: Date;
  modifiedAt: Date;
}
