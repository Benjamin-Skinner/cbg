import {
	ImageAR,
	ImageOptionGenerating,
	PageImage,
	GenerateImageResponse,
	Book,
} from '@/types'
import { midjourneyParams } from './midjourney'
import logger from '@/logging'
import StatusClass from '@/classes/Status'
import { MIDJOURNEY_BASE_URL } from '@/constants'

export async function generateRemixImages(
	softcoverImage: PageImage,
	messageId: string
): Promise<PageImage> {
	if (!messageId) {
		throw new Error(
			'It looks like the hardcover image was manually uploaded; Either manually upload the softcover image or generate a new hardcover image'
		)
	}
	console.log(`remixing image ${messageId}`)

	const optionGenerating = await sendRemixJob(messageId, softcoverImage.ar)

	const newImage = softcoverImage
	newImage.generatingImages.push(optionGenerating)

	// Set the status
	const newStatus = new StatusClass(newImage.status)
	newStatus.beginGenerating()
	newStatus.clearMessage()
	newImage.status = newStatus.toObject()

	return newImage
}

/**
 * @function sendRemixJob
 *
 * @summary
 * Should be called when the paperback cover is to be generated
 *
 * @param {string} prompt
 *
 * @returns {ImageOptionGenerating}
 * messageId: the messageId of the image to remix (the selected hardcover image)
 * ar: the aspect ratio of the image to generate
 *
 * @remarks STEP 1 of the Image Gen Pipeline
 */
export async function sendRemixJob(
	messageId: string,
	ar: ImageAR
): Promise<ImageOptionGenerating> {
	console.log('sendRemixJob')
	// Send the job to the API, get the messageId
	const response = await createRemixJob(messageId, ar)

	// Create a new midjourney job
	const midjourneyJob: ImageOptionGenerating = {
		messageId: response.messageId,
		progress: 0,
		completed: false,
		upscales: [],
		ar: ar,
		tiling: false,
		processing: false,
	}

	logger.info(
		`MIDJOURNEY remix job created with messageId ${midjourneyJob.messageId}`
	)

	return midjourneyJob
}

/**
 * Calls the MJ API and returns the raw unprocessed response
 */
async function createRemixJob(
	messageId: string,
	ar: ImageAR
): Promise<GenerateImageResponse> {
	const params = midjourneyParams(ar, false) // false for no tiling
	const fullPrompt = `. ${params}`
	const response = await fetch(
		`${MIDJOURNEY_BASE_URL}/api/v1/midjourney/button`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
			body: JSON.stringify({
				messageId: messageId,
				prompt: fullPrompt,
				button: 'Vary (Subtle)',
			}),
		}
	)

	const data = await response.json()
	console.log('raw MJ response')
	console.log(data)
	if (data.error) {
		throw new Error(data.error)
	}

	return data as GenerateImageResponse
}

// function getHardcoverMessageIdFromUrl(book: Book, url: string): string {
// 	const hardcoverImage = book.frontCover.hard.image

// 	for (const option of hardcoverImage.generatingImages) {
// 		console.log(option)
// 		for (const upscale of option.upscales) {
// 			console.log(upscale)
// 			if (upscale.url === url) {
// 				return upscale.messageId
// 			}
// 		}
// 	}

// 	throw new Error('Hardcover image not found')
// }
