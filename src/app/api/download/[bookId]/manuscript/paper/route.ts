import CBGError from '@/classes/Error'
import logger from '@/logging'

export async function GET() {
	try {
		logger.error('Tried to download manuscript')
		throw new Error(
			'The manuscript download feature is not yet implemented'
		)
	} catch (e: any) {
		return new CBGError(
			e.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
