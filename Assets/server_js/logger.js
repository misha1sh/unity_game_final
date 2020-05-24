const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';
logger.info("Starting server");

module.exports = logger;