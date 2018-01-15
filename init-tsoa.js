const env = require('node-env-file');
const fs = require('fs');
const path = require('path');
if (fs.existsSync(process.cwd() + '/.env')) {
  env(process.cwd() + '/.env');
}
const config = require('config');

function patchTsoa() {
  const hostPort = `${config.get('express.host')}:${config.get('express.port')}`;
  try {
    const tsoaCommonFilePath = path.resolve(process.cwd() + '/common-tsoa.json');
    const tsoaFilePath = path.resolve(process.cwd() + '/tsoa.json');
    let tsoaJson = JSON.parse(fs.readFileSync(tsoaCommonFilePath, 'utf8'));
    tsoaJson.swagger.host = hostPort;
    fs.writeFileSync(tsoaFilePath, JSON.stringify(tsoaJson, '', 2), {encoding: 'utf8'});
  } catch (e) {
    console.error(e);
  }
}

patchTsoa();

module.exports = patchTsoa;

