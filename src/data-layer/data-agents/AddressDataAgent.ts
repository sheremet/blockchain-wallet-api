import {logger} from '../../middleware/common/logging';
import {IAddressDocument, AddressRepo, AddressSchema} from '../data-abstracts/repositories/Address';
import {IAddress, IAddressSchema} from '../../business-layer/Address';

export class AddressDataAgent {

  async addAddress(addressData: IAddress): Promise<IAddressSchema> {
    const result = await AddressRepo.create(addressData);
    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'Address was not created'
      };
    } else {
      return result.address;
    }
  }

  async updateAddress(addressData: IAddressSchema) {
    const {address, walletId} = addressData;
    const result = await AddressRepo.update({}, addressData).where({
      'address.walletId': walletId,
      'address.address': address
    });
    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'Address was not updated'
      };
    } else {
      return result.address;
    }
  }

  async removeAddress(address: string) {
    const result = await AddressRepo.remove({}).where({
      'address.address': address
    });
    if (!result) {
      throw {
        thrown: true,
        success: false,
        status: 503,
        message: 'Address was not removed'
      };
    } else {
      return result;
    }
  }

  async sendPayment(fromAddress: string, toAddress: string, amount: number) {

  }

  async getBalance(address: string) {

  }

}
