import CBGError from '@/classes/Error'
import uploadImage from '@/functions/uploadImage'
import { NextResponse } from 'next/server'
import { HARDCOVER_AR, SQUARE_AR } from '@/constants'
import { addImageOptionBackCover } from '@/functions/addImageOption'

export async function POST(request: Request) {
	console.log('Back Cover Upload')
	try {
		const newImageOption = await uploadImage(
			request,
			HARDCOVER_AR,
			addImageOptionBackCover
		)
		return NextResponse.json(newImageOption)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
