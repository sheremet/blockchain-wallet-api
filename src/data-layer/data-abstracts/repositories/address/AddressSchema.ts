import {Schema} from 'mongoose';
import {getCurrentDateTime} from '../../../../shared/helper';
import {IAddressDocument} from './IAddressDocument';

const Address = {
  label: {
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
  }
};

const AddressSchema = new Schema({
  address: Address,
  createdAt: {
    type: Date,
    default: getCurrentDateTime()
  },
  modifiedAt: {
    type: Date,
    default: getCurrentDateTime()
  }
});

AddressSchema.pre('save', (next: any) => {
  if (this._doc) {
    const doc = this._doc as IAddressDocument;
    const now = getCurrentDateTime();

    if (!doc.createdAt) {
      doc.createdAt = now;
    }

    doc.modifiedAt = now;

    if (!this.isModified('password')) {
      return next();
    }
  }

  next();
});

export {AddressSchema};
