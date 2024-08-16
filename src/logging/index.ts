import { createLogger, format } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import * as path from 'path'
const { combine, timestamp, printf } = format
// Define custom format
const customFormat = printf(({ level, message, timestamp }) => {
	return `[${timestamp}] ${level.toUpperCase()}: ${message}`
})

const logLevels = {
	error: 0,
	info: 1,
}

// Create the logger
const logger = createLogger({
	levels: logLevels,
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
	transports: [
		new DailyRotateFile({
			filename: path.join('logs', 'application-%DATE%.log'),
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '14d',
		}),
	],
})

export default logger
