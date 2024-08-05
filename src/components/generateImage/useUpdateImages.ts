import { useEffect, useRef } from 'react'
import { PageImage } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

export const useUpdateImages = (
	image: PageImage,
	updateImage: (image: PageImage, options?: UpdateBookOptions) => void,
	apiUrl: string,
	bookId: string,
	setNewImages: (newImages: boolean) => void
) => {
	const imageRef = useRef(image)

	// Update the ref whenever the book changes
	useEffect(() => {
		imageRef.current = image
	}, [image])

	const updateImages = async () => {
		console.log('UPDATING IMAGES')

		const res = await fetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({
				bookId,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const { data } = (await res.json()) as { data: PageImage }

			console.log('new PageImage received ')

			if (
				!data.status.generating.inProgress &&
				data.status.message.code !== 'error' &&
				data.imageOptions.length > 0
			) {
				console.log('no longer generating; job done')
				setNewImages(true)
			}

			await updateImage(data, {
				clientOnly: true,
			})
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
