import { Book, ImageOption } from '@/types'
import { updateBook } from '@/functions/updateBook'

export async function addImageOptionInsideCover(
	book: Book,
	newImageOption: ImageOption
) {
	console.log('addImageOptionInsideCover')

	const allImageOptions = [
		...book.insideCover.image.imageOptions,
		newImageOption,
	]

	const newBook = {
		...book,
		insideCover: {
			...book.insideCover,
			image: {
				...book.insideCover.image,
				imageOptions: allImageOptions,
			},
		},
	}

	await updateBook(newBook)
}
