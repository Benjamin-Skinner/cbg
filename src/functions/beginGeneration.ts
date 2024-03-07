// import clientPromise from '@/util/db'
// import { Book } from '@/types'
// import StatusClass from '@/classes/Status'

// async function updateOutline(book: Book) {
// 	console.log('status updating')
// 	const client = await clientPromise
// 	const db = client.db()
// 	const books = db.collection('books')

// 	const newStatus = new StatusClass(book.outline.status)
// 	newStatus.beginGenerating()

// 	await books.findOneAndUpdate({ id: book.id }, { $set: { outline } })
// }
