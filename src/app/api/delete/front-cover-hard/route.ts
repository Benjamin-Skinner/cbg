import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionFrontCoverHard } from '@/functions/removeImageOption'

export async function POST(request: Request) {
	console.log('Front Cover Hard Delete')
	try {
		await deleteImage(request, removeImageOptionFrontCoverHard)
		return NextResponse.json({ success: true })
	} catch (e: any) {
		console.error(e)
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
