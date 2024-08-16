import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Subject } from '@/types'
import clientPromise from '@/util/db'
import { generateSubjects } from '@/generate/text/subject'
import { getAllSubjects } from '@/functions/getAllSubjects'

export async function POST(req: Request, res: Response) {
	const params = await req.json()
	const { error, isError } = ensureParams(params, ['options', 'prompt'])

	if (isError && error) {
		return error.toResponse()
	}

	const options = params.options
	const prompt = params.prompt

	try {
		// Generate subjects
		const subjects: Subject[] = await generateSubjects(options, prompt)

		const allSubjects = await saveSubjects(subjects)

		return NextResponse.json(
			{
				data: allSubjects,
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

// Insert the new subjects to the database and DROP all the old ones that are not saved
async function saveSubjects(subjects: Subject[]): Promise<Subject[]> {
	const client = await clientPromise
	const db = client.db()
	const collection = db.collection('subjects')

	// Get all the old subjects
	const oldSubjects = await collection.find({}).toArray()
	// Drop all the old subjects that are not saved
	for (const oldSubject of oldSubjects) {
		if (!oldSubject.saved) {
			await collection.deleteOne({ _id: oldSubject._id })
		} else {
			// set current to false
			await collection.updateOne(
				{ _id: oldSubject._id },
				{ $set: { current: false } }
			)
		}
	}

	// Insert the new subjects
	for (const subject of subjects) {
		await collection.insertOne(subject)
	}

	const allSubjects = await getAllSubjects()
	console.log(allSubjects)
	return allSubjects
}
