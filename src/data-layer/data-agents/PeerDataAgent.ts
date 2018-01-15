import {logger} from '../../middleware/common/logging';
import {PeerRepo} from '../data-abstracts/repositories/peers';
import {IPeerSchema, Peer} from '../../business-layer/peer';
import {PeerModel} from '../models/PeerModel';
import {axiosInst, executeAllPromises} from '../../shared/helper';
import {EventEmitter} from 'events';

export const checkPeersEmitter = new EventEmitter();

checkPeersEmitter.once('peerCheckStart', (interval: number = 10000) => {
  setInterval(() => {
    PeerDataAgent.checkPeers().then(() => {
      logger.info('Peers checked');
    });
  }, interval);
});

export class PeerDataAgent {

  public static async checkPeers() {
    const promArr = [];
    const errorsPeersArr = [];
    const errorsPeerPromArr = [];
    return PeerDataAgent.getPeersModel().then((peers) => {
      if (peers.length) {
        peers.forEach((peerAddress) => {
          promArr.push(axiosInst(peerAddress, '').head('/ping'));
        });
      }
    }).then(() => {
      if (promArr.length) {
        return executeAllPromises(promArr).then(({results, errors}) => {
          if (errors.length) {
            errors.forEach((err) => {
              const {code, address, port} = err;
              errorsPeersArr.push({code, address, port});
            });
          }
        });
      }
    }).then(() => {
      if (errorsPeersArr.length) {
        errorsPeersArr.forEach(({address, port}) => {
          errorsPeerPromArr.push(PeerDataAgent.removePeer({address, port}));
        });
      }
    }).then(() => {
      if (errorsPeerPromArr.length) {
        return executeAllPromises(errorsPeerPromArr).then(() => {
          logger.log('checkPeers', 'All unreached peers has been removed');
        });
      }
    });
  }

  private static async removePeer(peerAddress) {
    const {address, port} = peerAddress;
    return PeerRepo
      .remove({'address.host': address, 'address.port': port})
      .then(() => {
        logger.info('Next peer removed:', peerAddress);
      });
  }

  private static async getPeersModel() {
    return PeerRepo.find().then((res) => {
      return Promise.resolve(res.map((item) => {
        return new PeerModel(item).getFullAddress();
      }));
    });
  }

  async createOrUpdatePeer(address: IPeerSchema) {
    const hash = Peer.createHashFromAddress(address);
    logger.info('hash', hash);
    const peerFound = await PeerRepo.findOne().where({
      hash
    }).then((currPeer) => {

      if (currPeer) { // Peer exist, updating:
        currPeer.address = {...currPeer.address, ...address};
        currPeer.hash = hash;
        return currPeer.save();
      } else {
        return Promise.resolve(null);
      }
    }).catch((err) => {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'DB error when find a peer address'
      };
    });

    if (!peerFound) {
      const result = await PeerRepo.create({address, hash});
      if (!result) {
        throw {
          thrown: true,
          success: false,
          status: 503,
          message: 'Peer not created'
        };
      } else {
        const finalResult = new PeerModel(result);
        return Promise.resolve({
          hash,
          message: 'created',
          address: finalResult.getFullAddress()
        });
      }
    } else {
      return Promise.resolve({
        hash,
        message: 'updated',
        address: Peer.getAddressStr(address)
      });
    }

  }

  async getPeers(): Promise<any> {
    return PeerDataAgent.getPeersModel().catch((err) => {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Peers not found'
      };
    });
  }

  async getPeer(hash: string): Promise<any> {
    logger.info('hash', hash);
    return PeerRepo.findOne().where('hash').equals(hash)
      .then((result) => {
        logger.info('getPeer', result);
        const finalResult = new PeerModel(result).getFullAddress();
        return Promise.resolve(finalResult);
      })
      .catch((err) => {
        throw {
          thrown: true,
          success: false,
          status: 404,
          message: 'Peer not found'
        };
      });
  }

}
