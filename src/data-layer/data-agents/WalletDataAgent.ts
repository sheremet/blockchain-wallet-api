import {logger} from '../../middleware/common/logging';
import {IWalletDocument, WalletRepo, WalletSchema} from '../data-abstracts/repositories/wallet';
import {ISendMoney, IWallet, IWalletSchema, IWalletSchemaUpdate} from '../../business-layer/wallet';
import {AddressRepo} from '../data-abstracts/repositories/address';
import {IErrorResponse} from '../../service-layer/responses';
import {WalletModel} from '../models/WalletModel';
import {axiosInst, randomIntFromRange} from '../../shared/helper';
import {PeerDataAgent} from './PeerDataAgent';

export class WalletDataAgent {

  protected peerDataAgent = null;

  constructor() {
    this.peerDataAgent = new PeerDataAgent();
  }

  async createWallet(walletData: IWallet): Promise<any> {
    const result = await WalletRepo.create({wallet: walletData});
    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'Wallet not created'
      };
    } else {
      return Promise.resolve(result.wallet);
    }
  }

  async updateWallet(walletId: string, userId: string, walletData: IWalletSchemaUpdate): Promise<any> {

    let result;
    let currWallet;
    try {
      currWallet = await WalletRepo.findOne().where({
        'wallet.walletId': walletId,
        'wallet.userId': userId,
      });
    } catch (e) {
      logger.error('updateWallet', e);
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Wallet not found'
      };
    }

    if (!currWallet) {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Wallet not found'
      };
    } else {
      currWallet.wallet = {...currWallet.wallet, ...walletData};
      result = await currWallet.save();
    }

    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'Wallet not updated'
      };
    } else {
      const finalResult = new WalletModel(result).getOwnerWalletModel();
      return Promise.resolve(finalResult);
    }

  }

  async getWallets(userId: string): Promise<any> {
    logger.info('userId', userId);
    return WalletRepo.find().where({
      'wallet.userId': userId
    }).then((res) => {
      return Promise.resolve(res.map((item) => {
        return new WalletModel(item).getClientWalletModel();
      }));
    }).catch((err) => {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Wallets not found'
      };
    });
  }

  async getWallet(walletId: string): Promise<any> {
    logger.info('walletId', walletId);
    try {
      return WalletRepo.findOne({}).where('wallet.walletId').equals(walletId)
        .then((result) => {
          logger.info('getWallet', result);
          const finalResult = new WalletModel(result).getOwnerWalletModel();
          return Promise.resolve(finalResult);
        })
        .catch((err) => {
          throw {
            thrown: true,
            success: false,
            status: 404,
            message: 'Wallet not found'
          };
        });
    } catch (e) {
      logger.error('getWallet', e);
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Wallet not found'
      };
    }

  }

  async getAddresses(walletId: string): Promise<any> {
    const result = await AddressRepo.find().where('address.walletId', walletId);
    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Addresses not found'
      };
    } else {
      return Promise.resolve(result.map((item) => {
        return item.address;
      }));
    }
  }

  async getTransactionsByAddress(address: string): Promise<any> {
    const peerAddress = await this.getRandomPeerAddress();
    return axiosInst(peerAddress).get(`/blockchain/transactions/${address}`).then(({data}) => {
      return Promise.resolve(data);
    }).catch((err) => {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Transactions not found'
      };
    });
  }

  async getBalanceByAddress(address: string): Promise<any> {
    return this.getBalanceByAddressModel(address).then(({data}) => {
      return Promise.resolve(data);
    }).catch((err) => {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'No Transactions for this address',
        data: {
          balance: 0
        }
      };
    });
  }

  async sendPayment(payment: ISendMoney, userId: string) {
    const {senderWalletId, amount, receiverWalletId} = payment;
    const senderWallet = await WalletRepo.findOne().where({
      'wallet.walletId': senderWalletId,
      'wallet.userId': userId
    });
    const receiverWallet = await WalletRepo.findOne().where({
      'wallet.walletId': receiverWalletId
    });

    if (senderWallet && receiverWallet) {
      const {address: senderAddress} = new WalletModel(senderWallet).getOwnerWalletModel();
      const balanceResponse = await this.getBalanceByAddressModel(senderAddress);
      const {data: {balance}} = balanceResponse.data;
      logger.info('balanceResponse', balance);
      if (balance > amount) {
        const peerAddress = await this.getRandomPeerAddress();
        const {address: receiverAddress} = new WalletModel(receiverWallet).getOwnerWalletModel();
        return axiosInst(peerAddress).post(`/blockchain/transaction`, {
          from: senderAddress,
          to: receiverAddress,
          amount
        }).then(({data}) => {
          logger.info('/blockchain/transaction:data', data);
          return Promise.resolve(data.data);
        }).catch((e) => {
          throw {
            thrown: true,
            success: false,
            status: 500,
            message: 'Payment not processed'
          };
        });
      } else {
        throw {
          thrown: true,
          success: false,
          status: 400,
          message: 'You have less coins then in payment amount',
          data: {
            balance,
            paymentAmount: amount
          }
        };
      }

    } else {
      throw {
        thrown: true,
        success: false,
        status: 404,
        message: 'Wallet with this payment information does not exist'
      };
    }
  }

  private async getBalanceByAddressModel(address: string): Promise<any> {
    const peerAddress = await this.getRandomPeerAddress();
    return axiosInst(peerAddress).get(`/blockchain/balance/${address}`);
  }

  private async getRandomPeerAddress(): Promise<any> {
    const peers = await this.peerDataAgent.getPeers();
    const maxIndex = peers.length - 1;
    const randomPeerIndex = randomIntFromRange(0, maxIndex);
    return Promise.resolve(peers[randomPeerIndex]);
  }
}
