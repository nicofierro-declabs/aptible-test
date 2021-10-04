import winston from 'winston';

const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint()
            )
        })
    ]
})

export default logger;