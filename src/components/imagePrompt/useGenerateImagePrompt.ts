import { useEffect, useRef } from 'react'
import { Book, ImagePrompt } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

const useGenerateImagePrompt = (
	updatePrompt: (prompt: ImagePrompt, options: UpdateBookOptions) => void,
	prompt: ImagePrompt,
	apiUrl: string,
	bookId: string,
	pageKey: string
) => {
	// Use a ref to store the current book
	const promptRef = useRef(prompt)

	// Update the ref whenever the book changes
	useEffect(() => {
		promptRef.current = prompt
	}, [prompt])

	const generateImagePrompt = async () => {
		const newStatus = new StatusClass(promptRef.current.status)
		newStatus.beginGenerating()

		// Update the book with the new status
		updatePrompt(
			{
				...promptRef.current,
				status: newStatus.toObject(),
			},
			{
				clientOnly: true,
			}
		)

		// Call the API and get a new ImagePrompt in return
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
			const { data } = (await res.json()) as { data: ImagePrompt }

			await updatePrompt(data, {
				clientOnly: true,
			})
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(promptRef.current.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			// Update the book with the new status
			updatePrompt(
				{
					...promptRef.current,
					status: newStatus.toObject(),
				},
				{
					clientOnly: true,
				}
			)
		}
	}

	return {
		generateImagePrompt,
	}
}

export default useGenerateImagePrompt
