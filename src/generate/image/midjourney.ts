import {
	GenerateImageResponse,
	ImageOption,
	MidjourneyResponse,
	PageImage,
} from '@/types'
import { BookPages, ImageOptionGenerating, UpscaleJob } from '@/types'

export async function createMidjourneyJob(
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

export async function getMidJourneyImage(
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
	console.log(data)
	return data
}

/**
 * @function sendMidjourneyJob
 *
 * @summary
 * Given a prompt, will return the ImageGeneratingOption that corresponds to it
 *
 * @param {string} prompt
 *
 * @returns {ImageOptionGenerating}
 * messageId: the new messageId given by the midjourney API
 * progress: the progress of the job (will be 0)
 * completed: whether the job is completed (will be false)
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
 * @function upscaleMidjourneyJob
 *
 * @summary
 *  Takes a completed midjourney generation and returns the new array of upscale jobs
 *  If this function is called, we know that some number of upscale jobs need to be created
 *  We cannot create a new upscale job until the previous one is completed
 *
 * @param {ImageOptionGenerating} job
 *
 * @returns {UpscaleJob[]} an array containing all for upscale jobs for the grid
 *
 * @remarks
 *  - STEP 2 of the Image Gen Pipeline
 *  - Each upscale job will be monitored by the next step. We only need to
 *      keep track of the messageId, not the URL
 */

export async function upscaleMidjourneyJob(
	job: ImageOptionGenerating
): Promise<UpscaleJob[]> {
	console.log('in upscaleMidjourneyJob')
	const currUpscale = job.upscales.length
	const upscales: UpscaleJob[] = job.upscales

	if (currUpscale === 0) {
		console.log('creating first upscale job')
		// Create the first job
		const u1 = await sendUpscaleJob(job.messageId, 'U1')
		upscales.push(u1)
		return upscales
	} else if (currUpscale === 1) {
		// Check if the first is done; if not, return. If it is, create the second
		if (upscales[0].progress < 100) {
			console.log('first upscale job is not yet complete')
			return upscales
		} else {
			// Create the second job
			console.log('creating second upscale job')
			const u2 = await sendUpscaleJob(job.messageId, 'U2')
			upscales.push(u2)
			return upscales
		}
	} else if (currUpscale === 2) {
		// Check if the second is done; if not, return. If it is, create the third
		if (upscales[1].progress < 100) {
			console.log('second upscale job is not yet complete')
			return upscales
		} else {
			console.log('creating third upscale job')
			const u3 = await sendUpscaleJob(job.messageId, 'U3')
			upscales.push(u3)
			return upscales
		}
	} else if (currUpscale === 3) {
		// Check if the third is done; if not, return. If it is, create the fourth
		if (upscales[2].progress < 100) {
			console.log('third upscale job is not yet complete')
			return upscales
		} else {
			console.log('creating fourth upscale job')
			const u4 = await sendUpscaleJob(job.messageId, 'U4')
			upscales.push(u4)
			return upscales
		}
	} else {
		// All jobs are done
		console.log('SHOULD NOT REACH HERE')
		return upscales
	}
}

export async function sendUpscaleJob(
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
 * @function midjourneyResponseToImageOption
 *
 * @summary
 * Takes a complete upscaled imageJob and returns a corresponsing ImageOption
 *
 * @param {MidjourneyResponse} response
 *
 * @returns {ImageOption} the completed imageOption
 *
 * @remarks
 * - STEP 3 of the Image Gen Pipeline
 */

export function upscaleToImageOption(upscale: UpscaleJob): ImageOption {
	return {
		url: upscale.url,
		error: upscale.error || '',
		type: 'midjourney',
	}
}

/**
 * @function handleUpscaleJob
 *
 * @summary
 * Takes an upscale job and returns the new
 *
 * @param
 *
 * @returns
 *
 * @remarks
 */

export async function handleUpscaleJob(
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
