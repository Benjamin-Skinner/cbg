import { NextResponse } from 'next/server'
import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { saveSubject } from '@/util/subject'

export async function POST(request: Request) {
	const params = await request.json()
	const { error, isError } = ensureParams(params, ['subjectId'])

	if (isError && error) {
		return error.toResponse()
	}
	try {
		const subjectId = params.subjectId

		await saveSubject(subjectId)
		console.log('subject saved')

		return NextResponse.json('Success', {
			status: 200,
		})
	} catch (e: any) {
		return new CBGError(
			e.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
