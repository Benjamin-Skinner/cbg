import { useEffect, useRef } from 'react'
import { Book, ImagePrompt } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

// const useGenerateImagePrompt = (
// 	updateBook: (book: Book, options: UpdateBookOptions) => void,
// 	book: Book,
// 	fieldPath: string[],
// 	apiUrl: string
// ) => {
// 	// Use a ref to store the current book
// 	const bookRef = useRef(book)

// 	// Update the ref whenever the book changes
// 	useEffect(() => {
// 		bookRef.current = book
// 	}, [book])

// 	// Generates a new prompt and sets it
// 	const generateImagePrompt = async () => {
// 		console.log(`GENERATING IMAGE PROMPT for ${fieldPath.join(' -> ')}`)
// 		const initialImagePrompt: ImagePrompt = getNestedField(
// 			bookRef.current,
// 			[...fieldPath, 'image', 'prompt']
// 		)

// 		// Update the status as generating
// 		const newStatus = new StatusClass(initialImagePrompt.status)
// 		newStatus.beginGenerating()
// 		const updatedBook = JSON.parse(JSON.stringify(bookRef.current))
// 		setNestedField(
// 			updatedBook,
// 			[...fieldPath, 'image', 'prompt', 'status'],
// 			newStatus.toObject()
// 		)
// 		updateBook(updatedBook, { clientOnly: true })

// 		const res = await fetch(apiUrl, {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				book: bookRef.current,
// 			}),
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		})

// 		// SUCCESS --> update the state with the new generated prompt
// 		if (res.status === 200) {
// 			const { data } = (await res.json()) as { data: ImagePrompt }
// 			console.log('GENERATION SUCCESS')

// 			// Update the nested field with the new data
// 			setNestedField(updatedBook, fieldPath, data)
// 			await updateBook(updatedBook, { clientOnly: true })
// 		} else {
// 			console.log('GENERATION ERROR')
// 			const { error, code } = await res.json()
// 			console.error(`${code}: ${error}`)

// 			const newStatus = new StatusClass(initialImagePrompt.status)
// 			newStatus.setError(error)
// 			newStatus.clearGenerating()
// 			setNestedField(
// 				updatedBook,
// 				[...fieldPath, 'image', 'prompt', 'status'],
// 				newStatus.toObject()
// 			)
// 			updateBook(updatedBook, { clientOnly: true })
// 		}
// 	}

// 	return {
// 		generateImagePrompt,
// 	}
// }

// export default useGenerateImagePrompt

/**
 * *************** HELPER FUNCTIONS ***************
 */
// const getNestedField = (obj: any, path: string[]): any => {
// 	return path.reduce((acc, key) => acc[key as keyof typeof acc], obj)
// }

// const setNestedField = (obj: any, path: string[], value: any): void => {
// 	const lastKey = path.pop()
// 	if (!lastKey) return // Handle the case where path is empty
// 	const nestedObj = getNestedField(obj, path)
// 	nestedObj[lastKey as keyof typeof nestedObj] = value
// }

const useGenerateImagePrompt = (
	updatePrompt: (prompt: ImagePrompt, options: UpdateBookOptions) => void,
	prompt: ImagePrompt,
	apiUrl: string,
	bookId: string
) => {
	// Use a ref to store the current book
	const promptRef = useRef(prompt)

	// Update the ref whenever the book changes
	useEffect(() => {
		promptRef.current = prompt
	}, [prompt])

	const generateImagePrompt = async () => {
		console.log('GENERATING IMAGE PROMPT for back cover')
		// ?
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
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = (await res.json()) as { data: ImagePrompt }
			console.log('GENERATION SUCCESS')

			await updatePrompt(data, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
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
