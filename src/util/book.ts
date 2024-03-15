import { Book } from '@/types'
export function getFullBookDescription(book: Book): string {
	return (
		book.description.hardcover.first +
		' ' +
		book.description.hardcover.second +
		' ' +
		book.description.hardcover.third
	)
}
