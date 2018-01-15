/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { AuthorizationsController } from './../../service-layer/controllers/AuthorizationController';
import { UsersController } from './../../service-layer/controllers/UsersController';
import { WalletController } from './../../service-layer/controllers/WalletController';
import { PeerController } from './../../service-layer/controllers/PeerController';
import { expressAuthentication } from './../../business-layer/security/Authentication';

const models: TsoaRoute.Models = {
    "IUserResponse": {
        "properties": {
            "id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "firstname": { "dataType": "string" },
            "lastname": { "dataType": "string" },
        },
    },
    "IUserLoginRequest": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "IMessageResponse": {
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "status": { "dataType": "double", "required": true },
            "message": { "dataType": "string", "required": true },
        },
    },
    "IUserCreateRequest": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "firstname": { "dataType": "string", "required": true },
            "lastname": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
        },
    },
    "IErrorResponse": {
        "properties": {
            "status": { "dataType": "double", "required": true },
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "errors": { "dataType": "array", "array": { "dataType": "any" } },
        },
    },
    "IUserUpdateRequest": {
        "properties": {
            "id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "firstname": { "dataType": "string" },
            "lastname": { "dataType": "string" },
            "email": { "dataType": "string" },
            "admin": { "dataType": "boolean" },
        },
    },
    "ISuccessResponse": {
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "status": { "dataType": "double", "required": true },
            "data": { "dataType": "any", "required": true },
        },
    },
    "IWalletCreateRequest": {
        "properties": {
            "password": { "dataType": "string", "required": true },
            "label": { "dataType": "string", "required": true },
        },
    },
    "IWalletSchemaUpdate": {
        "properties": {
            "password": { "dataType": "string" },
            "label": { "dataType": "string" },
        },
    },
    "ISendMoney": {
        "properties": {
            "senderWalletId": { "dataType": "string", "required": true },
            "receiverWalletId": { "dataType": "string", "required": true },
            "amount": { "dataType": "double", "required": true },
        },
    },
    "IPeerUpdatedResponseDataObj": {
        "properties": {
            "hash": { "dataType": "string", "required": true },
            "address": { "dataType": "string", "required": true },
        },
    },
    "IPeerUpdatedResponse": {
        "properties": {
            "data": { "dataType": "any", "required": true },
            "success": { "dataType": "boolean", "required": true },
            "status": { "dataType": "double", "required": true },
            "message": { "dataType": "string", "required": true },
        },
    },
    "IPeerCreatedResponseDataObj": {
        "properties": {
            "hash": { "dataType": "string", "required": true },
            "address": { "dataType": "string", "required": true },
        },
    },
    "IPeerCreatedResponse": {
        "properties": {
            "data": { "ref": "IPeerCreatedResponseDataObj", "required": true },
            "success": { "dataType": "boolean", "required": true },
            "status": { "dataType": "double", "required": true },
            "message": { "dataType": "string", "required": true },
        },
    },
    "IPeerCreateRequest": {
        "properties": {
            "host": { "dataType": "string", "required": true },
            "port": { "dataType": "double", "required": true },
            "protocol": { "dataType": "string" },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/api/auth/login',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "IUserLoginRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthorizationsController();


            const promise = controller.login.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/auth/logout',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new AuthorizationsController();


            const promise = controller.logout.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/users/signup',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "IUserCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.RegisterNewUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/users/:userId',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.GetUserById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/users/username/:username',
        function(request: any, response: any, next: any) {
            const args = {
                username: { "in": "path", "name": "username", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.GetUserByUsername.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.patch('/api/users',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "body", "name": "request", "required": true, "ref": "IUserUpdateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UsersController();


            const promise = controller.Update.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/merchant/wallet',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "IWalletCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.createWallet.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/merchant/wallet/:wallet_id',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                walletId: { "in": "path", "name": "wallet_id", "required": true, "dataType": "string" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "IWalletSchemaUpdate" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.updateWallet.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/merchant/wallets',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.getWallets.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/merchant/wallet/:wallet_id',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                walletId: { "in": "path", "name": "wallet_id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.getWalletById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/merchant/address/:address/transactions',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                address: { "in": "path", "name": "address", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.getWalletTransactionsByAddress.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/merchant/address/:address/balance',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                address: { "in": "path", "name": "address", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.getBalanceByAddress.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/merchant/wallet/send-coin',
        authenticateMiddleware([{ "name": "api_key" }]),
        function(request: any, response: any, next: any) {
            const args = {
                body: { "in": "body", "name": "body", "required": true, "ref": "ISendMoney" },
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new WalletController();


            const promise = controller.sendMoneyToWalletId.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/peer',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                body: { "in": "body", "name": "body", "required": true, "ref": "IPeerCreateRequest" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new PeerController();


            const promise = controller.createPeer.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/peers',
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new PeerController();


            const promise = controller.getPeers.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/peer/:hash',
        function(request: any, response: any, next: any) {
            const args = {
                hash: { "in": "path", "name": "hash", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new PeerController();


            const promise = controller.getPeerByHash.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, response: any, next: any) => {
            let responded = 0;
            let success = false;
            for (const secMethod of security) {
                expressAuthentication(request, secMethod.name, secMethod.scopes).then((user: any) => {
                    // only need to respond once
                    if (!success) {
                        success = true;
                        responded++;
                        request['user'] = user;
                        next();
                    }
                })
                    .catch((error: any) => {
                        responded++;
                        if (responded == security.length && !success) {
                            response.status(401);
                            next(error)
                        }
                    })
            }
        }
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
