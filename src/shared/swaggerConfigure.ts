import * as config from 'config';
import * as fs from 'fs';
import {logger} from '../middleware/common/logging';

export function swaggerConfig(swaggerFilePath) {

  const hostPort = `${config.get('express.host')}:${config.get('express.port')}`;
  try {
    const swaggerJson = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
    swaggerJson.host = hostPort;
    fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerJson, null, 2), {encoding: 'utf8'});
  } catch (e) {
    logger.error(e);
  }

}
