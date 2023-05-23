import winston from "winston"
import config from "../config/config.js"

const customLevelOpt = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'magenta',
    warning: 'yellow',
    info: 'black',
    http: 'green',
    debug: 'blue'
  }
}

const warningFilter = winston.format((info, opts) => {
  return info.level === 'warning' ? info : false;
});

const debugHttpInfoFilter = winston.format((info, opts) => {
  if (info.level === 'debug' || info.level === 'http' || info.level === 'info') {
    return info  
  } else {
    return false;    
  }  
});

const logger = winston.createLogger({   
  levels: customLevelOpt.levels, //Defino que los levels del logger sea                                                 0n los propios
  //A partir de winstone.createLogger creamos nuestro logger con los transportes que necesitamos, en este caso, definimos
  //un transporte de consola para funcionar solo a partir del nivel http
  transports: [    
/*    new winston.transports.File({ 
      level: 'warning',
      filename: './logs/warning.log',
      format: winston.format.combine(
        winston.format.simple(),
        warningFilter()
      )      
    }),    
    new winston.transports.File({ 
      level: 'info',
      filename: './logs/info.log',
      format: winston.format.combine(
        winston.format.simple(),
        debugHttpInfoFilter()
      )      
    })     */
  ]
})


// Solamente incluimos el console si estamos en el ambiente de desarrollo
if (config.environment === 'desarrollo') {
  logger.add(
    new winston.transports.Console({ 
      level: 'debug',      
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOpt.colors}),
        winston.format.simple()
      )
    })
  );
}

// Si es produccion grabam,os archivo a partir del nivel info
if (config.environment === 'produccion') {
  logger.add(
    new winston.transports.Console({ 
      level: 'info',      
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOpt.colors}),
        winston.format.simple()
      )
    })
  );
  logger.add(
    new winston.transports.File({
      level: 'error',
      filename: './logs/errors.log',
      format: winston.format.combine(
        winston.format.simple()
      )
    }) 
  );
}

//Ahora , a partir de un middleware, vamos a colocar en el objeto req el logger, aprovecharemos ademas para hacer nuestro primer log.
//un  transporte de consola para funcionar solo a partir del nivel http
export const addLogger = (req,res, next) =>{
  req.logger = logger //Poder uitilizar el logger definido previamemtre
  req.logger.info(`${req.method} en  ${req.url} - ${new Date().toLocaleTimeString()}`)
  next()
}


