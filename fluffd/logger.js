const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || "debug";

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.json()
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;