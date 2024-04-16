import {
	GenerateImageResponse,
	ImageOption,
	MidjourneyResponse,
	PageImage,
} from '@/types'
import { ImageOptionGenerating, UpscaleJob } from '@/types'
import StatusClass from '@/classes/Status'

/**
 * *************** EXPORTED FUNCTIONS ***************
 */

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
	prompt: string
): Promise<ImageOptionGenerating> {
	// Send the job to the API, get the messageId
	const response = await createMidjourneyJob(prompt)

	// Create a new midjourney job
	const midjourneyJob: ImageOptionGenerating = {
		messageId: response.messageId,
		progress: 0,
		completed: false,
		upscales: [],
	}

	return midjourneyJob
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
	const newImages = { ...images }
	const generatingImages = images.generatingImages

	if (generatingImages.length === 0) {
		console.log('No generating images')
		let newStatus = new StatusClass(newImages.status)
		newStatus.clearGenerating()
		newStatus.setAsSuccess()
		newImages.status = newStatus.toObject()
		return newImages
	}

	for (let i = 0; i < generatingImages.length; i++) {
		const job = generatingImages[i]
		if (!job.progress) job.progress = 0

		console.log('JOB', job)
		// The job is done and all the upscales have already been completed
		if (job.completed) {
			console.log('JOB ALREADY COMPLETED')
			continue
		}

		let imgResponseProgress = 0

		// If the image was not done last cycle, refetch it
		if (job.progress < 100) {
			console.log('UPDATING PROGRESS')
			const imageResponse = await getMidJourneyImage(job.messageId)
			imgResponseProgress = imageResponse.progress
			// Make sure there's no error
			// newImages.status.message = {
			// 	code: '',
			// 	content: '',
			// 	dismissed: false,
			// }
			// Update the progress
			newImages.generatingImages[i].progress = imageResponse.progress
			newImages.status.generating.progress =
				10 + imageResponse.progress * 0.2

			if (imageResponse.status === 'FAIL') {
				console.log('MAIN IMAGE FAILED')
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
		else if (job.progress === 100 || imgResponseProgress === 100) {
			console.log(
				`job.progress = ${job.progress} and imgResponseProgress = ${imgResponseProgress}`
			)
			console.log('NEED TO UPSCALE JOB')
			const currUpscale = job.upscales.length

			// There has not been any upscale requested yet
			if (currUpscale === 0) {
				console.log('creating first upscale job')
				const u1 = await sendUpscaleJob(job.messageId, 'U1')
				newImages.generatingImages[i].upscales.push(u1)
			}

			// One upscale job has been created; analyze the progress
			else if (currUpscale === 1) {
				console.log('currUpscale === 1')
				// Process the first upscale job and extract the new data plus the new image option (if needed)
				const { upscale } = await handleUpscaleJob(
					newImages.generatingImages[i].upscales[0],
					i
				)

				// Add the new data to the page.image
				newImages.generatingImages[i].upscales[0] = upscale

				// Create second upscale job if the first one is done
				if (upscale.completed) {
					console.log('Creating a new upscale job')
					const u2 = await sendUpscaleJob(job.messageId, 'U2')
					newImages.generatingImages[i].upscales.push(u2)
					newImages.status.generating.progress = 40
				}
			} else if (currUpscale === 2) {
				console.log('currUpscale === 2')
				// Process the second upscale job and extract the new data plus the new image option (if needed)
				const { upscale } = await handleUpscaleJob(
					newImages.generatingImages[i].upscales[1],
					i
				)

				// Add the new data to the page.image
				newImages.generatingImages[i].upscales[1] = upscale

				// Create third upscale job if the second one is done
				if (upscale.completed) {
					console.log('Creating a new upscale job')
					newImages.status.generating.progress = 60
					const u3 = await sendUpscaleJob(job.messageId, 'U3')
					newImages.generatingImages[i].upscales.push(u3)
				}
			} else if (currUpscale === 3) {
				console.log('currUpscale === 3')
				// Process the third upscale job and extract the new data plus the new image option (if needed)
				const { upscale } = await handleUpscaleJob(
					newImages.generatingImages[i].upscales[2],
					i
				)

				// Add the new data to the page.image
				newImages.generatingImages[i].upscales[2] = upscale

				// Create fourth upscale job if the third one is done
				if (upscale.completed) {
					console.log('Creating a new upscale job')
					newImages.status.generating.progress = 80
					const u4 = await sendUpscaleJob(job.messageId, 'U4')
					newImages.generatingImages[i].upscales.push(u4)
				}
			} else if (currUpscale === 4) {
				console.log('currUpscale === 4')
				// Process the fourth upscale job and extract the new data plus the new image option (if needed)
				const { upscale } = await handleUpscaleJob(
					newImages.generatingImages[i].upscales[3],
					i
				)

				newImages.generatingImages[i].upscales[3] = upscale

				// If this one is done, the entire job is done
				if (upscale.completed) {
					newImages.status.generating.progress = 100
					// Make all the new image options
					const newImageOptions = job.upscales.map((upscale) =>
						upscaleToImageOption(upscale)
					)
					console.log(
						`There are ${newImageOptions.length} new image options`
					)
					const allImageOptions =
						newImages.imageOptions.concat(newImageOptions)
					newImages.imageOptions = allImageOptions

					console.log('FINAL UPSCALE IS DONE')
					newImages.generatingImages[i].completed = true
					const newStatus = new StatusClass(newImages.status)
					newStatus.clearGenerating()
					newStatus.setAsSuccess()
					newImages.status = newStatus.toObject()
					console.log('STATUS UPDATED')
				}
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
	prompt: string
): Promise<GenerateImageResponse> {
	const response = await fetch(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/imagine`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
			body: JSON.stringify({
				prompt: prompt,
			}),
		}
	)

	const data = await response.json()
	if (data.error) {
		throw new Error(data.message.toString())
	}
	console.log(data)
	return data as GenerateImageResponse
}

/**
 * Used to request an upscale job from the midjourney API
 */
async function sendUpscaleJob(
	messageId: string,
	button: 'U1' | 'U2' | 'U3' | 'U4'
): Promise<UpscaleJob> {
	console.log(
		`upscaling image with messageId ${messageId} and button ${button}`
	)
	const response = await fetch(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/button`,
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
	console.log(data)
	return {
		messageId: data.messageId,
		completed: false,
		progress: 0,
		button: button,
		url: '',
		error: '',
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
	console.log('Fetching image from midjourney')

	const response = await fetch(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/message/${messageId}`,
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
		console.log('no progress, manually setting progress')
		data.progress = 0
	}

	if (data.status && data.status === 'FAIL') {
		console.log('failed')
		data.progress = 100
	}
	console.log(data)
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
	console.log('handling upscale job')
	const newUpscale = { ...upscale }

	if (!upscale.completed) {
		const response = await getMidJourneyImage(upscale.messageId)

		if (response.status && response.status === 'fail') {
			// Job failed
			console.log(`UPSCALE ${i + 1} FAILED`)
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
function upscaleToImageOption(upscale: UpscaleJob): ImageOption {
	return {
		url: upscale.url || '',
		error: upscale.error || '',
		type: 'midjourney',
	}
}
