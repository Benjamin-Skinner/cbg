import clientPromise from './db'
import { ObjectId } from 'mongodb'

export async function saveSubject(subjectId: string) {
	const client = await clientPromise
	const db = client.db()
	const collection = db.collection('subjects')

	const subject = await collection.findOne({ _id: new ObjectId(subjectId) })
	console.log('subject', subject)
	if (!subject) throw new Error('No subject found')
	subject.saved = !subject.saved
	await collection.updateOne(
		{ _id: new ObjectId(subjectId) },
		{ $set: subject }
	)
	return subject
}
