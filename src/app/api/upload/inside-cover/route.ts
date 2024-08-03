import CBGError from '@/classes/Error'
import uploadImage from '@/functions/uploadImage'
import { NextResponse } from 'next/server'
import { SQUARE_AR } from '@/constants'
import { addImageOptionInsideCover } from '@/functions/addImageOption'

export async function POST(request: Request) {
	console.log('Inside Cover Upload')
	try {
		const newImageOption = await uploadImage(
			request,
			SQUARE_AR,
			addImageOptionInsideCover
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
