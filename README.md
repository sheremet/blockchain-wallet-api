# Blockchain

## Configuring

### For `development` please edit `config/default.yaml`:

```yaml
express:
    port: 8080
    debug: 5858
    host: localhost

auth:
    jwt_secret: SuperSecret

mongo:
    urlClient: mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/blockchain
``` 

You can also use `.env` file in root of the project for set environment variables which overrides `config/default.yaml` according to `config/custom-environment-variables.yaml`

### For `production` please specify environment variables which override the `config/custom-environment-variables.yaml`:

```text
EXPRESS_PORT=9000
EXPRESS_HOST=192.168.1.206
EXPRESS_DEBUG=5858
JWT_SECRET=SuperSecretToken
MONGODB_URL=mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/blockchain_prod
LOG_LEVEL=warn
```

You can also use `.env` file in root of the project for set environment variables

## Starting project in production mode

```bash
npm start
```

## Starting project in Dev mode

```bash
npm run start:dev
```

## Starting project in Debug mode

```bash
npm run start:debug
```