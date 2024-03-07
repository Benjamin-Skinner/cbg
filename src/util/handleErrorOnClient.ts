import StatusClass from '@/classes/Status'
import { Book, Status } from '@/types'

/**
 * @function handleErrorOnClient
 *
 * @summary
 * When there is an error on the server such that the book's status is not updated by the server,
 * the book's status will remain as "generating" even though the generation is over and there is
 * an error. In that case, we call this function from the client..
 *
 * If res.status !== 200, then we call this function
 *
 * @param res - The response from the server
 * @param book - The book to update
 * @param updateBook - The function to update the book
 *
 * @returns nothing
 *
 * @remarks
 */
export async function handleErrorOnClient(
	res: Response,
	book: Book,
	updateBook: (book: Book) => void,
	status: Status
) {
	console.log('GENERATION ERROR')
	const { error, code } = await res.json()
	console.error(`${code}: ${error}`)
	const newStatus = new StatusClass(status)
	newStatus.setError(error)
	newStatus.clearGenerating()
	updateBook({
		...book,
		description: {
			...book.description,
			status: newStatus.toObject(),
		},
	})
}
