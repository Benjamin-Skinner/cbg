import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionFrontCoverPaper } from '@/functions/removeImageOption'

export async function DELETE(request: Request) {
	console.log('Front Cover Paper Delete')
	try {
		const newImage = await deleteImage(
			request,
			removeImageOptionFrontCoverPaper
		)
		return NextResponse.json(newImage)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
