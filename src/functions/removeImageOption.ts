import { Book, ImageOption } from '@/types'
import { updateBook } from '@/functions/updateBook'

export async function removeImageOptionInsideCover(
	book: Book,
	url: string
): Promise<ImageOption[]> {
	console.log('removeImageOptionInsideCover')

	const newImageOptions = book.insideCover.image.imageOptions.filter(
		(option) => option.url !== url
	)

	const newBook = {
		...book,
		insideCover: {
			...book.insideCover,
			image: {
				...book.insideCover.image,
				imageOptions: newImageOptions,
			},
		},
	}

	await updateBook(newBook)

	return newImageOptions
}
