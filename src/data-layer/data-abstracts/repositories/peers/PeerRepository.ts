import {MongooseAccess} from '../../../adapters/MongooseAccess';
import {Model} from 'mongoose';
import {PeerSchema} from './PeerSchema';
import {IPeerDocument} from './IPeerDocument';
import {checkPeersEmitter} from '../../../data-agents/PeerDataAgent';

export type PeerMod = Model<IPeerDocument>;

export const PeerRepo: PeerMod = MongooseAccess
  .mongooseConnection.on('open', () => {
    checkPeersEmitter.emit('peerCheckStart');
  })
  .model<IPeerDocument>('peers', PeerSchema)
;
