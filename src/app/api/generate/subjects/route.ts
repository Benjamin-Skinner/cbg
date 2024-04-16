import { ensureParams } from '@/util/ensureParams'
import sleep from '@/util/sleep'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Subject } from '@/types'
import clientPromise from '@/util/db'
import { Book } from '@/types'
import { generateSubjects } from '@/generate/text/subject'

export async function POST(req: Request, res: Response) {
	const params = await req.json()
	const { error, isError } = ensureParams(params, ['options'])

	if (isError && error) {
		return error.toResponse()
	}

	const options = params.options

	try {
		const batchNum = 0
		// Generate subjects
		const subjects: Subject[] = await generateSubjects(options, batchNum)

		saveSubjects(subjects)

		return NextResponse.json(
			{
				data: subjects,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function saveSubjects(subjects: Subject[]) {
	const client = await clientPromise
	const db = client.db()
	const collection = db.collection('subjects')

	await collection.insertMany(subjects)
}
