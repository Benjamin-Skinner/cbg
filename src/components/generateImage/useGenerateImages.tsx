import { useEffect, useRef } from 'react'
import { PageImage } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

export const useGenerateImages = (
	image: PageImage,
	updateImage: (image: PageImage, options?: UpdateBookOptions) => void,
	apiUrl: string,
	bookId: string,
	pageKey: string
) => {
	const imageRef = useRef(image)

	// Update the ref whenever the book changes
	useEffect(() => {
		imageRef.current = image
	}, [image])

	const generateImages = async () => {
		console.log('GENERATING IMAGES')

		// Update the status
		const newStatus = new StatusClass(imageRef.current.status)
		newStatus.beginGenerating()
		newStatus.clearMessage()

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

		const res = await fetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({
				bookId: bookId,
				pageKey: pageKey,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = (await res.json()) as { data: PageImage }
			console.log('GENERATION SUCCESS')

			await updateImage(data, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

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
		generateImages,
	}
}
