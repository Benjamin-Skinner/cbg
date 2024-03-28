import {
	BookPages,
	ImageOptionGenerating,
	UpscaleJob,
	ImageUpdate,
	ImageProgressUpdate,
} from '@/types'
import {
	createMidjourneyJob,
	getMidJourneyImage,
} from '@/generate/image/new-midjourney'

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
 * @function isMidjourneyJobComplete
 *
 * @summary
 * Given a midjourney job, will return whether the job is complete
 * - If complete, we need to call upscaleMidjourneyJob
 * - If not complete, we skip it until the next iteration
 *
 * @param {ImageOptionGenerating} job
 *
 * @returns {boolean}
 *
 * @remarks
 */

export function isMidjourneyJobComplete(job: ImageOptionGenerating): boolean {
	return job.progress === 100
}

/**
 * @function upscaleMidjourneyJob
 *
 * @summary
 *  Takes a completed midjourney generation and upscales all for subimages
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
): Promise<UpscaleJob[]> {}

/**
 * @function isUpscaleJobComplete
 *
 * @summary
 * Given an upscale job, will return whether the job is complete
 *
 * @param {UpscaleJob} job
 *
 * @returns {boolean} whether the upscale job is complete
 *
 * @remarks
 *
 */

export async function isUpscaleJobComplete(job: UpscaleJob): Promise<boolean> {
	return job.progress === 100
}

/**
 * @function jobToImageOption
 *
 * @summary
 * Takes a complete upscaled imageJob and returns a corresponsing ImageOption
 *
 * @param {UpscaleJob} job
 *
 * @returns {ImageOption} the completed imageOption
 *
 * @remarks
 * - STEP 3 of the Image Gen Pipeline
 */

/**
 * @function fetchImages
 *
 * @summary
 * Runs on a cycle. Each iteration should do the following:
 *
 * 1. Check each ImageOptionGenerating for each page
 * 2. If the job is at progress === 100 but not marked as "completed", call upscaleMidjourneyJob and update the job
 * 3. If the job is at progress < 100, update the progress
 * 4. If the job is at progress === 100 and "completed", skip it
 *
 * 5. Check each UpscaleJob for each ImageOptionGenerating
 * 6. if the job is at progress < 100, update the progress
 * 7. if the job is at progress === 100 and it is not "completed", call jobToImageOption and update the job and the book
 * 8. if the job is at progress === 100 and it is "completed", skip it
 *
 * @param {BookPages} pages
 *
 * @returns {ImageUpdate}
 *
 * @remarks
 * Returns an object containing the information about what the new images are and what the new statuses are
 *
 * We use this object to update the book
 */

export async function fetchImages(pages: BookPages): Promise<ImageUpdate> {
	const finalImageUpdate: ImageUpdate = {
		progressUpdates: [],
		newOptions: [],
	}

	const newPages = { ...pages }
	// Start with content pages
	for (let i = 0; i < newPages.chapters.length; i++) {
		const page = newPages.chapters[i]

		// Get list of all generating images for the given page and iterate
		const generatingImages = page.image.generatingImages
		for (let j = 0; j < generatingImages.length; j++) {
			const job = generatingImages[j]

			if (job.completed) {
				continue
			}

			// Fetch the job from the Midjourney server
			const imageResponse = await getMidJourneyImage(job.messageId)

			// The image is complete but hasn't been upscaled yet
			if (imageResponse.progress === 100) {
				// Upscale the job
				const upscales = await upscaleMidjourneyJob(job)
				// Add the upscales to the job
			}

			// Update the progress either way
			const progressUpdate: ImageProgressUpdate = {
				messageId: imageResponse.messageId,
				progress: imageResponse.progress,
				pageKey: page.key,
			}

			finalImageUpdate.progressUpdates.push(progressUpdate)
		}
	}

	return finalImageUpdate
}
