import { Book, ImageOption, PageImage } from '@/types'
import { updateBook } from '@/functions/updateBook'

export async function removeImageOptionInsideCover(
	book: Book,
	url: string
): Promise<PageImage> {
	console.log('removeImageOptionInsideCover')

	// Make a list of new image options
	const newImageOptions = book.insideCover.image.imageOptions.filter(
		(option) => option.url !== url
	)

	// Check if the image is selected; if so, unselect it
	let selectedUrl = book.insideCover.image.image
	if (selectedUrl === url) {
		console.log('deleted image was selected; deselecting')
		selectedUrl = ''
	}

	const newImage: PageImage = {
		...book.insideCover.image,
		image: selectedUrl,
		imageOptions: newImageOptions,
	}

	const newBook: Book = {
		...book,
		insideCover: {
			...book.insideCover,
			image: newImage,
		},
	}

	await updateBook(newBook)

	return newImage
}

export async function removeImageOptionFrontCoverHard(
	book: Book,
	url: string
): Promise<PageImage> {
	console.log('removeImageOptionFrontCoverHard')

	const newImageOptions = book.frontCover.hard.image.imageOptions.filter(
		(option) => option.url !== url
	)

	// Check if the image is selected; if so, unselect it
	let selectedUrl = book.frontCover.hard.image.image
	if (selectedUrl === url) {
		console.log('deleted image was selected; deselecting')
		selectedUrl = ''
	}

	const newImage: PageImage = {
		...book.frontCover.hard.image,
		image: selectedUrl,
		imageOptions: newImageOptions,
	}

	const newBook: Book = {
		...book,
		frontCover: {
			...book.frontCover,
			hard: {
				...book.frontCover.hard,
				image: newImage,
			},
		},
	}

	await updateBook(newBook)
	return newImage
}

export async function removeImageOptionFrontCoverPaper(
	book: Book,
	url: string
): Promise<PageImage> {
	console.log('removeImageOptionFrontCoverPaper')

	const newImageOptions = book.frontCover.paper.image.imageOptions.filter(
		(option) => option.url !== url
	)

	// Check if the image is selected; if so, unselect it
	let selectedUrl = book.frontCover.paper.image.image
	if (selectedUrl === url) {
		console.log('deleted image was selected; deselecting')
		selectedUrl = ''
	}

	const newImage: PageImage = {
		...book.frontCover.paper.image,
		image: selectedUrl,
		imageOptions: newImageOptions,
	}

	const newBook: Book = {
		...book,
		frontCover: {
			...book.frontCover,
			paper: {
				...book.frontCover.paper,
				image: newImage,
			},
		},
	}

	await updateBook(newBook)
	return newImage
}

export async function removeImageOptionBackCover(
	book: Book,
	url: string
): Promise<PageImage> {
	console.log('removeImageOptionBackCover')

	const newImageOptions = book.backCover.image.imageOptions.filter(
		(option) => option.url !== url
	)

	// Check if the image is selected; if so, unselect it
	let selectedUrl = book.backCover.image.image
	if (selectedUrl === url) {
		console.log('deleted image was selected; deselecting')
		selectedUrl = ''
	}

	const newImage: PageImage = {
		...book.backCover.image,
		image: selectedUrl,
		imageOptions: newImageOptions,
	}

	const newBook: Book = {
		...book,
		backCover: {
			...book.backCover,
			image: newImage,
		},
	}

	await updateBook(newBook)
	return newImage
}
