import download from 'image-downloader'
import { Book, BookPages, Page, PageImage } from '@/types'
import { getImageUrlId } from './url'
import fs from 'fs'
import { put } from '@vercel/blob'
import { v4 } from 'uuid'

// import { getNewImageUrl } from '@/generate/image/midjourney'
import updatePageImage from '@/functions/updatePageImage'
import { updateBook } from '@/functions/updateBook'

export function imageName(bookId: string, imageId: string) {
	return `${bookId}/${imageId}`
}

export async function downloadMidjourneyImage(
	url: string,
	book: Book,
	pageTitle: string
) {
	if (url === '') {
		throw new Error(`No image has been selected for ${pageTitle}`)
	}

	const imagePath = getImagePath(url, book)

	// Check if image already exists
	if (fs.existsSync(imagePath)) {
		console.log('Image already exists, skipping download')
		return { imgPath: imagePath }
	}

	console.log('Downloading image:', url)
	console.log(`Image path: ${imagePath}`)
	const options = {
		url: url,
		dest: imagePath,
	}

	// Tried downloading INTRO:
	// https://cdn.discordapp.com/attachments/1224442484629831763/1232413626401558589/benjaminskinner_watercolor_clip_art_on_a_white_background_of_a__f0312d91-14f8-4b79-9e49-9274e2b109d1.png?ex=66295e21&is=66280ca1&hm=dcceda4d05ef01cfc0b71ccdf91e86b709ed443799d1f485285a06899405113f&

	// Real url INTRO:
	// https://cdn.discordapp.com/attachments/1224442484629831763/1232413626401558589/benjaminskinner_watercolor_clip_art_on_a_white_background_of_a__f0312d91-14f8-4b79-9e49-9274e2b109d1.png?ex=662c0121&is=662aafa1&hm=e6226655197a6d28916468a7c1b5d1a64fe9b49f8ac36a02f8c90622b21d6dd8&
	return download
		.image(options)
		.then(({ filename }) => {
			console.log('Image successfully downloaded')
			return { imgPath: filename }
		})
		.catch((err: Error) => {
			console.log('Error downloading image:', err)
			throw err
		})
}

export function getImagePath(url: string, book: Book) {
	const imageDir = '/Users/Benskinner/Code/cbg/images'

	const urlId = getImageUrlId(url)

	return `${imageDir}/${book.id}/${urlId}.png`
}

// async function updatePageImageUrl(book: Book, page: Page) {
// 	const newUrl = await getNewImageUrl(page.image)
// 	console.log('New image url:', newUrl)
// 	page.image.image = newUrl

// 	return page
// }

// export async function getNewImageUrls(book: Book): Promise<Book> {
// 	const newIntro = await updatePageImageUrl(book, book.pages.intro)
// 	const newChapters = await Promise.all(
// 		book.pages.chapters.map(async (page) => {
// 			return await updatePageImageUrl(book, page)
// 		})
// 	)
// 	const newConclusion = await updatePageImageUrl(book, book.pages.conclusion)
// 	const updatedPages: BookPages = {
// 		intro: newIntro,
// 		chapters: newChapters,
// 		conclusion: newConclusion,
// 	}

// 	const updatedBook: Book = {
// 		...book,
// 		pages: updatedPages,
// 	}

// 	await updateBook(updatedBook)
// 	console.log('Old book:', book)
// 	console.log('Updated book:', updatedBook)
// 	return updatedBook
// }

export async function saveImageAsBlob(
	bookId: string,
	image: ReadableStream<Uint8Array>
) {
	const imageId = v4()
	const name = imageName(bookId, imageId)
	const blob = await put(name, image, {
		access: 'public',
	})

	return blob
}
