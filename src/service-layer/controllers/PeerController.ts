import {
  Route, Response, Get, Post, Patch, Header, Body, Security, Controller, Path, Tags, Request,
  Put
} from 'tsoa';
import {logger} from '../../middleware/common/logging';
import {validationErrorsFormatter} from '../../shared/validationErrorsFormatter';
import {IPeerCreateRequest} from '../request';
import {validatePeer} from '../../business-layer/validators/peer/PeerValidationProcessor';
import {
  createdResponse,
  successResponse,
  updatedResponse
} from '../../shared/helper';
import {PeerDataAgent} from '../../data-layer/data-agents/PeerDataAgent';
import {
  IPeerCreatedResponse, IErrorResponse, ISuccessResponse, IPeerUpdatedResponse,
  ICreatedResponse, IUpdatedResponse
} from '../responses';
import {IPeerUpdatedResponseDataObj} from '../responses/IPeerUpdatedResponse';
import {IPeerCreatedResponseDataObj} from '../responses/IPeerCreatedResponse';

@Route()
export class PeerController extends Controller {

  private peerDataAgent = new PeerDataAgent();

  @Response<IPeerUpdatedResponse>(200, 'Updated')
  @Response<IPeerCreatedResponse>(201, 'Created')
  @Response<IErrorResponse>(500, 'Peer not saved')
  @Post('peer')
  @Tags('Peers')
  public async createPeer(@Request() request: Request,
                          @Body() body: IPeerCreateRequest): Promise<ICreatedResponse | IUpdatedResponse> {
    const validationErrors: any[] = validatePeer(body);
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

    const result = await this.peerDataAgent.createOrUpdatePeer(reqData);
    if (result.hasOwnProperty('message')) {
      const {address, hash} = result;
      if (result.message === 'updated') {
        return updatedResponse<IPeerUpdatedResponseDataObj>({address, hash});
      }
      if (result.message === 'created') {
        this.setStatus(201);
        return createdResponse<IPeerCreatedResponseDataObj>({address, hash});
      }
    } else {
      throw {
        thrown: true,
        success: false,
        status: 500,
        message: 'Peer not saved'
      };
    }

  }

  @Get('peers')
  @Tags('Peers')
  public async getPeers(@Request() request: Request): Promise<ISuccessResponse> {
    const result = await this.peerDataAgent.getPeers();
    return successResponse<string[]>(result);
  }

  @Get('peer/{hash}')
  @Tags('Peers')
  public async getPeerByHash(@Path('hash') hash: string): Promise<ISuccessResponse> {
    const result = await this.peerDataAgent.getPeer(hash);
    return successResponse(result);
  }

}
