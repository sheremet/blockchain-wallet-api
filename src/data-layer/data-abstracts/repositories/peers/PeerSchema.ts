import {Schema} from 'mongoose';
import {getCurrentDateTime} from '../../../../shared/helper';
import {IPeerDocument} from './IPeerDocument';

const Peer = {
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  protocol: {
    type: String,
    default: 'http'
  }
};

const PeerSchema = new Schema({
  address: Peer,
  hash: {
    type: String,
    trim: true,
    required: true,
    index: {unique: true, dropDups: true}
  },
  createdAt: {
    type: Date,
    default: getCurrentDateTime()
  },
  modifiedAt: {
    type: Date,
    default: getCurrentDateTime()
  }
});

PeerSchema.pre('save', (next: any) => {
  if (this._doc) {
    const doc = this._doc as IPeerDocument;
    const now = getCurrentDateTime();

    if (!doc.createdAt) {
      doc.createdAt = now;
    }

    doc.modifiedAt = now;

  }

  next();
});

export {PeerSchema};
