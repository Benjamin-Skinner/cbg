import CBGError from '@/classes/Error'
import uploadImage from '@/functions/uploadImage'
import { NextResponse } from 'next/server'
import { RANDR_IMAGE_AR } from '@/constants'
import { addImageOptionRecallAndReflect } from '@/functions/addImageOption'

export async function POST(request: Request) {
	try {
		const newImageOption = await uploadImage(
			request,
			RANDR_IMAGE_AR,
			addImageOptionRecallAndReflect
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
