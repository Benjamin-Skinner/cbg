export function imageName(pageKey: string, imageId: string) {
	return `${pageKey}-${imageId}`
}

import download from 'image-downloader'
import { Book } from '@/types'
import { getImageUrlId } from './url'
import fs from 'fs'

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

	return download.image(options).then(({ filename }) => {
		console.log('Image successfully downloaded')
		return { imgPath: filename }
	})
}

export function getImagePath(url: string, book: Book) {
	const imageDir = '/Users/Benskinner/Code/cbg/images'

	const urlId = getImageUrlId(url)

	return `${imageDir}/${book.id}/${urlId}.png`
}
