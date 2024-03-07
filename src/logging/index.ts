import winston from 'winston'

const myFormat = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD hh:mm:ss.SSS A',
	}),
	winston.format.printf((info) => {
		const { message, location, level } = info
		return `[${info.timestamp}]${
			level === 'error' ? ` ${level.toUpperCase()}` : ''
		} ${message} ${location ? ` -- @${location}` : ''}`
	})
)

export const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			filename: 'logs/main.log',
		}),
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
	],
	format: myFormat,
})
