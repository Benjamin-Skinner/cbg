import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionBackCover } from '@/functions/removeImageOption'

export async function POST(request: Request) {
	console.log('Back Cover Delete')
	try {
		await deleteImage(request, removeImageOptionBackCover)
		return NextResponse.json({ success: true })
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
