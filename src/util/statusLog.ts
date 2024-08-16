import logger from '@/logging/index'
function logStatus(
	code: string,
	type: 'requested' | 'completed',
	bookId: string
) {
	if (type === 'requested') {
		logger.info(`${code} requested for book ${bookId}`)
	} else {
		logger.info(`${code} completed for book ${bookId}`)
	}
}

export default logStatus
