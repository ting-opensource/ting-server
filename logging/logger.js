const winston = require('winston');

var logger = new winston.Logger({
    level: 'debug',
    colors: {
        silly: 'grey',
        debug: 'cyan',
        verbose: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    },
    transports: [
      new winston.transports.Console({
          prettyPrint: true,
          colorize: true
      })
    ]
});

module.exports = logger;
