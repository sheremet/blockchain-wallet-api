import {MongooseAccess} from '../../../adapters/MongooseAccess';
import {Model} from 'mongoose';
import {AddressSchema} from './AddressSchema';
import {IAddressDocument} from './IAddressDocument';

export type AddressMod = Model<IAddressDocument>;

export const AddressRepo: AddressMod = MongooseAccess
  .mongooseConnection
  .model<IAddressDocument>('addresses', AddressSchema);
