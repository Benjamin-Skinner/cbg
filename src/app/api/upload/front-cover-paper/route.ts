import CBGError from '@/classes/Error'
import uploadImage from '@/functions/uploadImage'
import { NextResponse } from 'next/server'
import { SQUARE_AR } from '@/constants'
import { addImageOptionFrontCoverPaper } from '@/functions/addImageOption'

export async function POST(request: Request) {
	try {
		const newImageOption = await uploadImage(
			request,
			SQUARE_AR,
			addImageOptionFrontCoverPaper
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
