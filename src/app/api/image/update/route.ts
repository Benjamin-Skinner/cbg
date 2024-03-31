import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import sleep from '@/util/sleep'
import { NextResponse } from 'next/server'
import { Book, Page, PageImage } from '@/types'
import updatePageImage from '@/functions/updatePageImage'
import {
	createMidjourneyJob,
	getMidJourneyImage,
	upscaleMidjourneyJob,
	sendUpscaleJob,
	upscaleToImageOption,
	handleUpscaleJob,
} from '@/generate/image/midjourney'
import StatusClass from '@/classes/Status'

export async function POST(req: Request) {
	console.log('UPDATE IMAGE API ROUTE')
	try {
		const body = await req.json()
		const { isError, error } = ensureParams(body, [
			'book',
			'page',
			'intro',
			'conclusion',
		])
		if (isError && error) {
			return error.toResponse()
		}
		const images = body.page.image as PageImage
		const newImages = { ...images }

		// Update all of the images
		const generatingImages = images.generatingImages
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
				// Update the progress
				newImages.generatingImages[i].progress = imageResponse.progress
			}

			// The image is complete but hasn't been upscaled yet
			if (job.progress === 100 || imgResponseProgress === 100) {
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

					// Create second upscale job
					console.log('Creating a new upscale job')
					const u2 = await sendUpscaleJob(job.messageId, 'U2')
					newImages.generatingImages[i].upscales.push(u2)
				} else if (currUpscale === 2) {
					console.log('currUpscale === 2')
					// Process the second upscale job and extract the new data plus the new image option (if needed)
					const { upscale } = await handleUpscaleJob(
						newImages.generatingImages[i].upscales[1],
						i
					)

					// Add the new data to the page.image
					newImages.generatingImages[i].upscales[1] = upscale

					// Create third upscale job
					const u3 = await sendUpscaleJob(job.messageId, 'U3')
					newImages.generatingImages[i].upscales.push(u3)
				} else if (currUpscale === 3) {
					console.log('currUpscale === 3')
					// Process the third upscale job and extract the new data plus the new image option (if needed)
					const { upscale } = await handleUpscaleJob(
						newImages.generatingImages[i].upscales[2],
						i
					)

					// Add the new data to the page.image
					newImages.generatingImages[i].upscales[2] = upscale

					// Create fourth upscale job
					const u4 = await sendUpscaleJob(job.messageId, 'U4')
					newImages.generatingImages[i].upscales.push(u4)
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
						// Make all the new image options
						const newImageOptions = job.upscales.map((upscale) =>
							upscaleToImageOption(upscale)
						)
						console.log(
							`There are ${newImageOptions.length} new image options`
						)
						newImages.imageOptions = newImageOptions

						console.log('FINAL UPSCALE IS DONE')
						newImages.generatingImages[i].completed = true
						const newStatus = new StatusClass(newImages.status)
						newStatus.clearGenerating()
						newImages.status = newStatus.toObject()
						console.log('STATUS UPDATED')
					}
				}
			}
		}

		// Update the page image
		await updatePageImage(
			body.book as Book,
			newImages,
			body.page.key,
			body.intro,
			body.conclusion
		)

		return NextResponse.json(images)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
