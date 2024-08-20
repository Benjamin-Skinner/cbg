import { useEffect, useRef, useState } from 'react'
import { Page, PageImage, Status } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

export const useUpdateImages = (
	image: PageImage,
	updateImage: (image: PageImage, options?: UpdateBookOptions) => void,
	apiUrl: string,
	bookId: string,
	setNewImages: (newImages: boolean) => void,
	pageKey: string,
	setResponseReceived: (responseReceived: boolean) => void
) => {
	const imageRef = useRef(image)
	const [downloaded, setDownloaded] = useState(false)

	// Update the ref whenever the book changes
	useEffect(() => {
		imageRef.current = image
	}, [image])

	const updateImages = async () => {
		const res = await fetch(`${apiUrl}/update`, {
			method: 'POST',
			body: JSON.stringify({
				pageKey,
				bookId,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const newStatus = (await res.json()) as Status

			console.log('Polling update received: new status', newStatus)
			// Update the status on the client

			updateImage(
				{
					...imageRef.current,
					status: newStatus,
				},
				{
					clientOnly: true,
				}
			)

			// Check if the progress is 100
			if (newStatus.generating.progress === 100) {
				console.log('Progress is 100')
				// Done generating all; now time to download
				if (downloaded) {
					console.log('Already downloaded')
					// We've already sent a request to download
					return
				} else {
					console.log('Making reques to download')
					setDownloaded(true)
					setResponseReceived(false) // Reset for next time
					// Make download request
					const res = await fetch(`${apiUrl}/download`, {
						method: 'POST',
						body: JSON.stringify({
							pageKey,
							bookId,
						}),
						headers: {
							'Content-Type': 'application/json',
						},
					})

					const newImages = (await res.json()) as PageImage
					console.log('Download response', newImages)
					setNewImages(true)
					updateImage(newImages, {
						clientOnly: true,
					})
					setDownloaded(false)
				}
			}
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			// Update the status
			const newStatus = new StatusClass(imageRef.current.status)
			newStatus.setError(error)
			newStatus.clearGenerating()

			// Update the book with the new status
			await updateImage(
				{
					...imageRef.current,
					status: newStatus.toObject(),
				},
				{
					clientOnly: true,
				}
			)
		}
	}

	return {
		updateImages,
	}
}
