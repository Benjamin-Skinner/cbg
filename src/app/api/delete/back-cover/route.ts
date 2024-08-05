import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionBackCover } from '@/functions/removeImageOption'

export async function DELETE(request: Request) {
	console.log('Back Cover Delete')
	try {
		const newImage = await deleteImage(request, removeImageOptionBackCover)
		return NextResponse.json(newImage)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
