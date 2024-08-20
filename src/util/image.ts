import download from 'image-downloader'
import { Book, BookPages, ImageAR, Page, PageImage } from '@/types'
import { getImageUrlId } from './url'
import logger from '@/logging'
import fs from 'fs'
const sharp = require('sharp')
import {
	DEFAULT_AR,
	FULL_PAGE_AR,
	SQUARE_AR,
	HARDCOVER_AR,
	RANDR_IMAGE_AR,
} from '@/constants'
import { isApproximatelyEqual } from './math'

// export function imageName(bookId: string, imageId: string) {
// 	return `${bookId}/${imageId}`
// }

export async function downloadMidjourneyImage(
	url: string,
	book: Book,
	pageTitle?: string
) {
	if (url === '') {
		throw new Error(
			`No image has been selected for ${pageTitle || 'this page'}`
		)
	}

	// Check if the image directory exists; if not create it
	const imageDir = `${process.env.IMAGE_DIR}/${book.id}`
	if (!fs.existsSync(imageDir)) {
		console.log('Creating image directory', imageDir)
		fs.mkdirSync(imageDir)
	} else {
		console.log('Image directory already exists')
	}

	const imagePath = getImagePath(url, book)

	// Check if image already exists
	if (fs.existsSync(imagePath)) {
		console.log('Image already exists, skipping download')
		return { imgPath: imagePath }
	}

	const options = {
		url: url,
		dest: imagePath,
	}

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

function getImagePath(url: string, book: Book) {
	const imageDir = process.env.IMAGE_DIR

	const urlId = getImageUrlId(url)

	return `${imageDir}/${book.id}/${urlId}.png`
}

/**
 * Given an image, will return the width and height of the image
 */
export async function getImageDimensions(
	image: ReadableStream<Uint8Array>
): Promise<{ width: number; height: number }> {
	const buffer = await readableStreamToBuffer(image)
	const metadata = await sharp(buffer).metadata()

	if (!metadata || !metadata.width || !metadata.height) {
		throw new Error('Failed to read image')
	}

	// Return the width and height from the metadata
	return { width: metadata.width, height: metadata.height }
}

/**
 * Converts a ReadableStream<Uint8Array> to a Buffer
 */
export async function readableStreamToBuffer(
	stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
	const reader = stream.getReader()
	const chunks: Uint8Array[] = []

	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		if (value) chunks.push(value)
	}

	// Concatenate all Uint8Array chunks into a single Buffer
	return Buffer.concat(chunks)
}

/**
 * Takes a width and height of an image and needs to find the closest AR
 * one of:
 * - SQUARE_AR
 * - FULL_PAGE_AR
 * - HARDCOVER_AR
 * - RANDR_IMAGE_AR
 *
 */
export function arFromImageDimesions(
	width: number,
	height: number
): { ar: ImageAR; error: boolean } {
	// Image is square
	if (height === width) {
		return {
			ar: SQUARE_AR,
			error: false,
		}
	}

	const ar = width / height

	// AR is approximately 2.5, meaning it is a full-page image
	if (isApproximatelyEqual(ar, 2.5, 0.4)) {
		return {
			ar: FULL_PAGE_AR,
			error: false,
		}
	}

	// AR is about 0.77, meaning it is a hardcover image
	if (isApproximatelyEqual(ar, 0.77, 0.4)) {
		return {
			ar: HARDCOVER_AR,
			error: false,
		}
	}

	// AR is about 4, meaning it is a randr image
	if (isApproximatelyEqual(ar, 4, 0.4)) {
		return {
			ar: RANDR_IMAGE_AR,
			error: false,
		}
	}

	logger.info('Image AR not recognized', { width, height, ar })
	return {
		ar: DEFAULT_AR,
		error: true,
	}
}
