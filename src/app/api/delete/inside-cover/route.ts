import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionInsideCover } from '@/functions/removeImageOption'

export async function DELETE(request: Request) {
	console.log('Inside Cover Delete')
	try {
		const newImageOptions = await deleteImage(
			request,
			'insideCover',
			removeImageOptionInsideCover
		)
		return NextResponse.json(newImageOptions)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
