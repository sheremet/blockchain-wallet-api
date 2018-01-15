import {
  Route, Response as Resp, Get, Post, Patch, Header, Body, Security, Controller, Path, Tags, Request,
  Put
} from 'tsoa';
import {logger} from '../../middleware/common/logging';
import {validationErrorsFormatter} from '../../shared/validationErrorsFormatter';
import {IWalletCreateRequest} from '../request/IWalletCreateRequest';
import {validateWallet} from '../../business-layer/validators/wallet/WalletValidationProcessor';
import {getHash, getRandomString, getUserIdFromRequest, successResponse} from '../../shared/helper';
import {WalletDataAgent} from '../../data-layer/data-agents/WalletDataAgent';
import {IWalletSchema, IWalletSchemaUpdate} from '../../business-layer/wallet';
import {ISuccessResponse} from '../responses';
import {verifyToken} from '../../business-layer/security/token-helpers';
import {WalletModel} from '../../data-layer/models/WalletModel';
import {ISendMoney} from '../../business-layer/wallet/IWallet';
import {validatePayment} from '../../business-layer/validators/send-coins/SendCoinsValidationProcessor';

@Route('merchant')
export class WalletController extends Controller {

  private walletDataAgent = new WalletDataAgent();

  /**
   * @name createWallet
   * @description Create main wallet
   * @param {Request} request
   * @param {IWalletCreateRequest} body
   * @returns {Promise<any>}
   */
  @Security('api_key')
  @Post('wallet')
  @Tags('Wallet')
  public async createWallet(@Request() request: Request,
                            @Body() body: IWalletCreateRequest): Promise<ISuccessResponse> {
    const validationErrors: any[] = validateWallet(body);
    logger.info('RegisterNewUser  validationErrors =', validationErrors);
    const userId = getUserIdFromRequest(request);
    if (validationErrors.length > 0) {
      throw {
        thrown: true,
        success: false,
        status: 400,
        message: 'Incorrect input data',
        errors: validationErrorsFormatter(validationErrors)
      };
    }

    const reqData = {...body, userId, ...{address: getHash(getRandomString()), walletId: getRandomString()}};

    const result = await this.walletDataAgent.createWallet(reqData);

    return successResponse(result);
  }

  @Security('api_key')
  @Put('wallet/{wallet_id}')
  @Tags('Wallet')
  public async updateWallet(@Path('wallet_id') walletId: string,
                            @Request() request: Request,
                            @Body() body: IWalletSchemaUpdate): Promise<ISuccessResponse> {
    const userId = getUserIdFromRequest(request);
    const validationErrors: any[] = validateWallet(body);
    logger.info('RegisterNewUser  validationErrors =', validationErrors);
    if (validationErrors.length > 0) {
      throw {
        thrown: true,
        success: false,
        status: 400,
        message: 'Incorrect input data',
        errors: validationErrorsFormatter(validationErrors)
      };
    }
    const reqData = {...body};
    const result = await this.walletDataAgent.updateWallet(walletId, userId, reqData);
    const finalResult = new WalletModel(result).getOwnerWalletModel();
    return successResponse(finalResult);
  }

  @Security('api_key')
  @Get('wallets')
  @Tags('Wallet')
  public async getWallets(@Request() request: Request): Promise<ISuccessResponse> {
    const userId = getUserIdFromRequest(request);
    const result = await this.walletDataAgent.getWallets(userId);
    return successResponse(result);
  }

  @Security('api_key')
  @Get('wallet/{wallet_id}')
  @Tags('Wallet')
  public async getWalletById(@Path('wallet_id') walletId: string): Promise<ISuccessResponse> {
    const result = await this.walletDataAgent.getWallet(walletId);
    return successResponse(result);
  }

  @Security('api_key')
  @Get('address/{address}/transactions')
  @Tags('Address')
  public async getWalletTransactionsByAddress(@Path('address') address: string): Promise<ISuccessResponse> {
    const result = await this.walletDataAgent.getTransactionsByAddress(address);
    return successResponse(result.data);
  }

  @Security('api_key')
  @Get('address/{address}/balance')
  @Tags('Address')
  public async getBalanceByAddress(@Path('address') address: string): Promise<ISuccessResponse> {
    const result = await this.walletDataAgent.getBalanceByAddress(address);
    return successResponse(result.data);
  }

  @Security('api_key')
  @Post('wallet/send-coin')
  @Tags('Send coins')
  public async sendMoneyToWalletId(@Body() body: ISendMoney, @Request() request: Request) {
    const {receiverWalletId, senderWalletId, amount} = body;
    if (receiverWalletId === senderWalletId) {
      throw {
        thrown: true,
        success: false,
        status: 400,
        message: `You can't send coins to seders wallet!`
      };
    }
    const userId = getUserIdFromRequest(request);
    const validationErrors: any[] = validatePayment(body);
    logger.info('RegisterNewUser  validationErrors =', validationErrors);
    if (validationErrors.length > 0) {
      throw {
        thrown: true,
        success: false,
        status: 400,
        message: 'Incorrect input data',
        errors: validationErrorsFormatter(validationErrors)
      };
    }
    const reqData = {...body};
    const result = await this.walletDataAgent.sendPayment(reqData, userId);
    if (result) {
      return successResponse(result);
    }
  }

}
