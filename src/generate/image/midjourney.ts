import {
	GenerateImageResponse,
	ImageAR,
	ImageOption,
	ImageUpdateResponse,
	MidjourneyResponse,
	PageImage,
} from '@/types'
import { ImageOptionGenerating, UpscaleJob } from '@/types'
import StatusClass from '@/classes/Status'
import logger from '@/logging'
import { saveImageToAWS } from '@/util/aws/upload'
import { MIDJOURNEY_BASE_URL } from '@/constants'

/**
 * *************** EXPORTED FUNCTIONS ***************
 */

export async function generateImages(
	image: PageImage,
	tiling?: 'tiling' | 'no tiling'
): Promise<PageImage> {
	console.log('generateImages')
	// Make sure there is a prompt
	if (image.prompt.content === '') {
		throw new Error('Please enter a prompt')
	}

	const optionGenerating = await sendMidjourneyJob(
		image.prompt.content,
		image.ar,
		tiling || 'no tiling'
	)

	const newImage = image
	newImage.generatingImages.push(optionGenerating)

	// Set the status
	const newStatus = new StatusClass(newImage.status)
	newStatus.beginGenerating()
	newStatus.clearMessage()
	newImage.status = newStatus.toObject()

	return newImage
}

/**
 * @function sendMidjourneyJob
 *
 * @summary
 * Should be called when a new image is to be generated
 *
 * @param {string} prompt
 *
 * @returns {ImageOptionGenerating}
 * messageId: the new messageId given by the midjourney API
 * progress: the progress of the job (will be 0)
 * completed: whether the job is completed (will be false)
 * upscales: an array of upscale jobs (will be empty)
 *
 * @remarks STEP 1 of the Image Gen Pipeline
 */

export async function sendMidjourneyJob(
	prompt: string,
	ar: ImageAR,
	tiling: 'tiling' | 'no tiling'
): Promise<ImageOptionGenerating> {
	console.log('sendMidjourneyJob')
	// Send the job to the API, get the messageId
	const response = await createMidjourneyJob(
		prompt,
		ar,
		tiling === 'no tiling' ? false : true
	)

	// Create a new midjourney job
	const midjourneyJob: ImageOptionGenerating = {
		messageId: response.messageId,
		progress: 0,
		completed: false,
		upscales: [],
		ar: ar,
		tiling: tiling === 'no tiling' ? false : true,
		processing: false,
	}

	logger.info(
		`MIDJOURNEY job created with messageId ${midjourneyJob.messageId}`
	)

	return midjourneyJob
}

export async function createAllImageOptions(
	image: PageImage,
	bookId: string,
	lastTry?: boolean
): Promise<PageImage> {
	console.log('Create all image options')
	const newImages: PageImage = image

	// Right here everything is done but we need to create the new image options
	const generatingImages = image.generatingImages
	const i = generatingImages.length - 1

	if (i === -1) {
		console.log('returning')
		return newImages
	}
	const job = generatingImages[i]

	if (job.completed) {
		console.log('The job has already been completed')
		return newImages
	} else if (job.processing) {
		console.log('We are already processing the images, just return')
		return newImages
	} else {
		console.log(
			'The job is not completed and not processing, so save all the images'
		)
		console.log('job.upscales', job.upscales)

		// COnvert each of the upscales into a new image option
		const newImageOptions = job.upscales.map((upscale) =>
			upscaleToImageOption(upscale, bookId)
		)
		const resolvedNewImageOptions = await Promise.all(newImageOptions)
		// console.log('resolvedNewImageOptions', resolvedNewImageOptions)
		const allImageOptions = newImages.imageOptions.concat(
			resolvedNewImageOptions
		)

		// Add them to the PageImage
		newImages.imageOptions = allImageOptions

		// Mark the job as completed
		newImages.generatingImages[i].completed = true

		// Set the status to success
		const newStatus = new StatusClass(newImages.status)
		newStatus.clearGenerating()
		newStatus.setAsSuccess()
		newImages.status = newStatus.toObject()

		logger.info(`MIDJOURNEY image ${job.messageId} complete`)
	}

	// Return all the new image options

	if (newImages.imageOptions.length < 3 && !lastTry) {
		// Try the download again
		console.log('Trying the download again')
		return createAllImageOptions(newImages, bookId, true)
	}
	return newImages
}

/**
 * @function updateImages
 *
 * @summary
 *  Takes a page.image object and updates it by fetching each of it's processing jobs
 * and processing them
 *
 * @param {PageImage} images - the original images
 *
 * @returns {PageImage} the updated images
 *
 * @remarks
 */
export async function updateImages(images: PageImage): Promise<PageImage> {
	console.log('images in handlePoll', images)
	const newImages: PageImage = images
	newImages.status.generating.inProgress = true

	const generatingImages = images.generatingImages
	console.log(`There are ${generatingImages.length} generating images`)

	const i = generatingImages.length - 1

	if (i === -1) {
		throw new Error(
			'Job failed due to high request volume; please try again.'
		)
	}
	const job = generatingImages[i]

	if (!job.progress) job.progress = 0
	// The job is done and all the upscales have already been completed
	if (job.completed) {
		console.log('The job has already been completed')
		throw new Error(
			'Job failed due to high request volume; please try again.'
		)
	}

	let imgResponseProgress = job.progress

	// If the image was not done last cycle, refetch it
	if (job.progress < 100) {
		console.log(
			`Progress is less than 100 on main job so checking the status again`
		)
		const imageResponse = await getMidJourneyImage(job.messageId)
		console.log('imageResponse', imageResponse)
		imgResponseProgress = imageResponse.progress

		// Update the progress
		newImages.generatingImages[i].progress = imageResponse.progress
		newImages.status.generating.progress = 10 + imageResponse.progress * 0.2

		if (imageResponse.status === 'FAIL') {
			console.log('The job failed')
			logger.error(
				`MIDJOURNEY image failed with message ID ${imageResponse.messageId}`
			)
			newImages.generatingImages[i].completed = true
			newImages.status.generating.progress = 100
			const newStatus = new StatusClass(newImages.status)
			newStatus.clearGenerating()
			newStatus.setError(
				imageResponse.error ||
					'An error occurred while generating the image. Please try again.'
			)
			newImages.status = newStatus.toObject()
		}
	}

	// The image is complete but hasn't been upscaled yet
	if (imgResponseProgress === 100) {
		console.log('The main image is done, moving on to upscaling')
		const currUpscale = job.upscales.length
		console.log('currUpscale', currUpscale)

		// There has not been any upscale requested yet
		if (currUpscale === 0) {
			const u1 = await sendUpscaleJob(
				job.messageId,
				'U1',
				job.ar,
				job.tiling
			)
			newImages.generatingImages[i].upscales.push(u1)
			console.log('First upscale job added to generatingImages')
		}

		// One upscale job has been created; analyze the progress
		else if (currUpscale === 1) {
			// Process the first upscale job and extract the new data plus the new image option (if needed)
			const { upscale } = await handleUpscaleJob(
				newImages.generatingImages[i].upscales[0],
				i
			)

			console.log(
				'status of the first upscale (now updated in generatingImages)',
				upscale
			)

			// Add the new data to the page.image
			newImages.generatingImages[i].upscales[0] = upscale

			console.log(
				`There are now ${newImages.generatingImages[i].upscales.length} items in the upscale array`
			)

			// Create second upscale job if the first one is done
			if (upscale.completed) {
				console.log(
					'First upscale done, adding second one to generatingImages'
				)

				const u2 = await sendUpscaleJob(
					job.messageId,
					'U2',
					job.ar,
					job.tiling
				)
				newImages.generatingImages[i].upscales.push(u2)
				newImages.status.generating.progress = 40
				console.log('Setting pageImage progress to 40%')
			}
		} else if (currUpscale === 2) {
			// Process the second upscale job and extract the new data plus the new image option (if needed)
			const { upscale } = await handleUpscaleJob(
				newImages.generatingImages[i].upscales[1],
				i
			)

			console.log(
				'status of the second upscale (now updated in generatingImages)',
				upscale
			)

			// Add the new data to the page.image
			newImages.generatingImages[i].upscales[1] = upscale

			console.log(
				`There are now ${newImages.generatingImages[i].upscales.length} items in the upscale array`
			)

			// Create third upscale job if the second one is done
			if (upscale.completed) {
				console.log(
					'Second upscale done, adding third one to generatingImages'
				)
				newImages.status.generating.progress = 60
				console.log('Setting pageImage progress to 60%')
				const u3 = await sendUpscaleJob(
					job.messageId,
					'U3',
					job.ar,
					job.tiling
				)
				newImages.generatingImages[i].upscales.push(u3)
			}
		} else if (currUpscale === 3) {
			// Process the third upscale job and extract the new data plus the new image option (if needed)
			const { upscale } = await handleUpscaleJob(
				newImages.generatingImages[i].upscales[2],
				i
			)

			console.log(
				'status of the third upscale (now updated in generatingImages)',
				upscale
			)

			// Add the new data to the page.image
			newImages.generatingImages[i].upscales[2] = upscale

			console.log(
				`There are now ${newImages.generatingImages[i].upscales.length} items in the upscale array`
			)

			// Create fourth upscale job if the third one is done
			if (upscale.completed) {
				console.log(
					'Third upscale done, adding fourth one to generatingImages'
				)
				newImages.status.generating.progress = 80
				console.log('Setting pageImage progress to 80%')
				const u4 = await sendUpscaleJob(
					job.messageId,
					'U4',
					job.ar,
					job.tiling
				)
				newImages.generatingImages[i].upscales.push(u4)
			}
		} else if (currUpscale === 4) {
			// Process the fourth upscale job and extract the new data plus the new image option (if needed)
			const { upscale } = await handleUpscaleJob(
				newImages.generatingImages[i].upscales[3],
				i
			)

			console.log(
				'status of the fourth upscale (now updated in generatingImages)',
				upscale
			)

			newImages.generatingImages[i].upscales[3] = upscale

			console.log(
				`There are now ${newImages.generatingImages[i].upscales.length} items in the upscale array`
			)

			// If this one is done, the entire job is done
			if (upscale.completed) {
				console.log('Setting processing to true')
				console.log('Fourth upscale done, the entire job is done')

				console.log(
					'setting the pageImage status.generating.progress to 100%'
				)
				newImages.status.generating.progress = 100

				console.log(
					'now we just need to create the newImageOptions from upscales'
				)
			}
		}
	}
	return newImages
}

/**
 * *************** CREATE IMAGE ***************
 */

/**
 * Calls the MJ API and returns the raw unprocessed response
 */
async function createMidjourneyJob(
	prompt: string,
	ar: ImageAR,
	tiling: boolean
): Promise<GenerateImageResponse> {
	const params = midjourneyParams(ar, tiling)
	const fullPrompt = `${prompt} ${params}`
	const response = await fetch(
		`${MIDJOURNEY_BASE_URL}/api/v1/midjourney/imagine`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
			body: JSON.stringify({
				prompt: fullPrompt,
			}),
		}
	)

	const data = await response.json()
	if (data.error) {
		throw new Error(data.error)
	}
	return data as GenerateImageResponse
}

/**
 * Used to request an upscale job from the midjourney API
 */
async function sendUpscaleJob(
	messageId: string,
	button: 'U1' | 'U2' | 'U3' | 'U4',
	ar: ImageAR,
	tiling: boolean
): Promise<UpscaleJob> {
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
				button: button,
			}),
		}
	)
	const data = (await response.json()) as GenerateImageResponse
	return {
		messageId: data.messageId,
		completed: false,
		progress: 0,
		button: button,
		url: '',
		error: '',
		ar: ar,
		tiling: tiling,
	}
}

/**
 * *************** CHECK PROGRESS  ***************
 */

/**
 * Used to fetch the image from the midjourney API and return the raw unprocessed response
 */
async function getMidJourneyImage(
	messageId: string
): Promise<MidjourneyResponse> {
	const response = await fetch(
		`${MIDJOURNEY_BASE_URL}/api/v1/midjourney/message/${messageId}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
		}
	)

	const data = (await response.json()) as MidjourneyResponse
	if (!data.progress) {
		data.progress = 0
	}

	if (data.status && data.status === 'FAIL') {
		data.progress = 100
	}
	return data
}

/**
 * Takes an upscale job and processes it, returning the new upscale job based on the data from the MJ API
 */
async function handleUpscaleJob(
	upscale: UpscaleJob,
	i: number
): Promise<{
	upscale: UpscaleJob
}> {
	const newUpscale = { ...upscale }

	if (!upscale.completed) {
		const response = await getMidJourneyImage(upscale.messageId)
		console.log('getMJResponse', response)

		if (response.status && response.status === 'fail') {
			// Job failed
			newUpscale.completed = true
			newUpscale.progress = 100
			newUpscale.url = ''
			newUpscale.error =
				response.error ||
				'An error occurred while upscaling the image. Please try again.'
		} else if (response.progress < 100) {
			// Update the progress
			newUpscale.progress = response.progress
		} else if (response.progress === 100) {
			// Job is done but has not been added to the imageOptions

			// Make new image option
			newUpscale.url = response.uri

			// Mark as complete
			newUpscale.completed = true
			newUpscale.progress = 100
		}
	}

	return {
		upscale: newUpscale,
	}
}

/**
 * *************** UTIL ***************
 */

/**
 * Converts an upscale job to an image option
 */
async function upscaleToImageOption(
	upscale: UpscaleJob,
	bookId: string
): Promise<ImageOption> {
	try {
		const imageBlob = await fetchImageWithRetry(upscale.url, 3, 4)

		// Convert the Blob to a ReadableStream<Uint8Array>
		const stream = imageBlob.stream()

		// Save the image to Blob storage and get the result
		const { savedUrl } = await saveImageToAWS(
			bookId,
			stream,
			upscale.messageId
		)

		return {
			url: savedUrl || '',
			error: upscale.error || '',
			type: 'midjourney',
			ar: upscale.ar,
			tiling: upscale.tiling,
			messageId: upscale.messageId,
		}
	} catch (error: any) {
		return {
			url: '',
			error: upscale.error || error.message,
			type: 'midjourney',
			ar: upscale.ar,
			tiling: upscale.tiling,
			messageId: upscale.messageId,
		}
	}
}

async function fetchImageWithRetry(
	url: string,
	retries: number,
	delay: number
): Promise<Blob> {
	let response: Response
	console.log('Trying to fetch image')
	if (url === '' || url === null || url === undefined) {
		throw new Error('URL returned from Midjourney is empty')
	}

	for (let attempt = 1; attempt <= retries; attempt++) {
		response = await fetch(url)
		const blob = await response.blob()

		if (response.ok && blob.size > 0) {
			console.log('Image fetched successfully')
			return blob
		} else {
			console.log(
				`Attempt ${attempt} failed, trying again in ${delay} seconds`
			)
		}

		// Wait for the specified delay before the next attempt
		await new Promise((resolve) => setTimeout(resolve, delay * 1000))
	}

	// If all attempts fail, throw an error
	throw new Error('Failed to fetch image after multiple attempts')
}

export function midjourneyParams(ar: ImageAR, tiling: boolean): string {
	let params = ''

	params += ` --ar ${ar.width}:${ar.height}`

	// if (tiling) {
	// 	params += ' --tile'
	// }

	return params
}
