import {MongooseAccess} from '../../../adapters/MongooseAccess';
import {Model} from 'mongoose';
import {WalletSchema} from './WalletSchema';
import {IWalletDocument} from './IWalletDocument';

export type WalletMod = Model<IWalletDocument>;

export const WalletRepo: WalletMod = MongooseAccess.mongooseConnection.model<IWalletDocument>('wallets', WalletSchema);
