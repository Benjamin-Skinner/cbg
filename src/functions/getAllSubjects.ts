import { Book, Subject } from '@/types'
import clientPromise from '@/util/db'
import { EXCLUDE } from '@/constants'

export async function getAllSubjects() {
	const client = await clientPromise
	const db = client.db()
	const subjectDocs = await db.collection('subjects').find({})

	const subjects = []

	for await (const subjectDoc of subjectDocs) {
		const subject: Subject = {
			id: subjectDoc._id.toString(),
			title: subjectDoc.title,
			oneLiner: subjectDoc.oneLiner,
			options: subjectDoc.options,
			createdAt: subjectDoc.createdAt,
			current: subjectDoc.current,
			saved: subjectDoc.saved,
		}
		subjects.push(subject)
	}

	const filtered = subjects

	return filtered
}

export async function getSavedSubjects() {
	const client = await clientPromise
	const db = client.db()
	const subjectDocs = await db.collection('subjects').find({ saved: true })

	const subjects = []

	for await (const subjectDoc of subjectDocs) {
		const subject: Subject = {
			id: subjectDoc._id.toString(),
			title: subjectDoc.title,
			oneLiner: subjectDoc.oneLiner,
			options: subjectDoc.options,
			createdAt: subjectDoc.createdAt,
			saved: subjectDoc.saved,
			current: subjectDoc.current,
		}
		subjects.push(subject)
	}

	const filtered = subjects

	return filtered
}
