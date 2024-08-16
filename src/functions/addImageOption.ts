import { Book, ImageOption, Page } from '@/types'
import { updateBook } from '@/functions/updateBook'
import getPageFromKey from '@/util/pageFromKey'
import updatePage from '@/functions/updatePage'
import logger from '@/logging'

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

export async function addImageOptionFrontCoverHard(
	book: Book,
	newImageOption: ImageOption
) {
	console.log('addImageOptionFrontCoverHard')

	const allImageOptions = [
		...book.frontCover.hard.image.imageOptions,
		newImageOption,
	]

	const newBook: Book = {
		...book,
		frontCover: {
			...book.frontCover,
			hard: {
				...book.frontCover.hard,
				image: {
					...book.frontCover.hard.image,
					imageOptions: allImageOptions,
				},
			},
		},
	}

	await updateBook(newBook)
}

export async function addImageOptionFrontCoverPaper(
	book: Book,
	newImageOption: ImageOption
) {
	console.log('addImageOptionFrontCoverPaper')

	const allImageOptions = [
		...book.frontCover.paper.image.imageOptions,
		newImageOption,
	]

	const newBook = {
		...book,
		frontCover: {
			...book.frontCover,
			paper: {
				...book.frontCover.paper,
				image: {
					...book.frontCover.paper.image,
					imageOptions: allImageOptions,
				},
			},
		},
	}

	await updateBook(newBook)
}

export async function addImageOptionBackCover(
	book: Book,
	newImageOption: ImageOption
) {
	console.log('addImageOptionBackCover')

	const allImageOptions = [
		...book.backCover.image.imageOptions,
		newImageOption,
	]

	const newBook = {
		...book,
		backCover: {
			...book.backCover,
			image: {
				...book.backCover.image,
				imageOptions: allImageOptions,
			},
		},
	}

	await updateBook(newBook)
}

export async function addImageOptionPage(
	book: Book,
	pageKey: string,
	newImageOption: ImageOption
) {
	const page = getPageFromKey(book, pageKey)

	const allImageOptions = [...page.image.imageOptions, newImageOption]

	const newPage: Page = {
		...page,
		image: {
			...page.image,
			imageOptions: allImageOptions,
		},
	}

	const isIntro = pageKey === 'intro'
	const isConclusion = pageKey === 'conclusion'

	// Save the new page
	await updatePage(book, newPage, isIntro, isConclusion)

	logger.info(`Uploaded image option to page ${pageKey} for book ${book.id}`)
}

export async function addImageOptionRecallAndReflect(
	book: Book,
	newImageOption: ImageOption
) {
	const allImageOptions = [
		...book.recallAndReflect.image.imageOptions,
		newImageOption,
	]

	const newBook = {
		...book,
		recallAndReflect: {
			...book.recallAndReflect,
			image: {
				...book.recallAndReflect.image,
				imageOptions: allImageOptions,
			},
		},
	}

	logger.info(
		`Uploaded image option to recall and reflect for book ${book.id}`
	)

	await updateBook(newBook)
}
