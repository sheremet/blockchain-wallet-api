import mongoose = require('mongoose');
import {IPeerSchema} from '../../../../business-layer/peer';

export interface IPeerDocument extends mongoose.Document {
  address: IPeerSchema;
  hash: string;
  createdAt: Date;
  modifiedAt: Date;
}
