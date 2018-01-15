import {MongooseAccess} from '../../../adapters/MongooseAccess';
import {Schema} from 'mongoose';
import * as Bcrypt from 'bcrypt-nodejs';
import {IUserDocument} from './IUserDocument';
import {getCurrentDateTime} from '../../../../shared/helper';

const SALT_WORK_FACTOR = 10;

/**
 * MongooseSchema
 * @type {"mongoose".Schema}
 * @private
 */
const UserSchema: Schema = new MongooseAccess.mongooseInstance.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    index: {unique: true, dropDups: true}
  },

  password: {
    type: String,
    required: true
  },

  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
  },

  admin: {
    type: Boolean,
    default: false
  },

  isLoggedIn: {
    type: Boolean,
    default: false
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

UserSchema.pre('save', function (next: any) {
  if (this._doc) {
    const doc = this._doc as IUserDocument;
    const now = getCurrentDateTime();

    if (!doc.createdAt) {
      doc.createdAt = now;
    }

    doc.modifiedAt = now;

    if (!this.isModified('password')) {
      return next();
    }

    doc.password = Bcrypt.hashSync(doc.password, Bcrypt.genSaltSync(SALT_WORK_FACTOR));
  }

  next();
});

UserSchema.method('comparePassword', _comparePassword);

function _comparePassword(candidatePassword: string, user): boolean {
  return Bcrypt.compareSync(candidatePassword, user.password);
}

export {UserSchema};
