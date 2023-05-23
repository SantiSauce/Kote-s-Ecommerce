import {createLogger, format, transports } from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const myFormat = format.combine(
    format.colorize({
        colors: {
            debug: 'white',
            info: 'green',
            http: 'blue',
            warn: 'yellow',
            error: 'red',
            fatal: 'magenta'
        },
        all: true }),
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      const stack = new Error().stack.split('\n')[3].trim().split(' ');
    //   const lineNumber = stack[stack.length - 1].split(':')[1];
      return `${timestamp} [${level}]: ${message}`;
    })
  );
const errorFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  );

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

const devTransports = [
  new transports.Console({
    level: 'debug', 
    format: myFormat,
  }),
];

const prodTransports = [
  new transports.Console({
    level: 'info',
    format: myFormat, 
  }),
  new transports.File({
    filename: "errors.log",
    level: "error",
    format: errorFormat,
  }), 
];

const devLogger = createLogger({
  levels,
  transports: devTransports,
});

const prodLogger = createLogger({
  levels,
  transports: prodTransports,
});


export const addLogger = (req, res, next) => {
    const enviroment = process.env.NODE_ENV;
    
    req.logger = enviroment === 'production' ? prodLogger : devLogger
  
    // const date = new Date().toLocaleDateString();
    // req.logger.info(`METHOD: ${req.method}, ENDPOINT: ${req.url}, DATE: ${date}`);
  
    next();
}