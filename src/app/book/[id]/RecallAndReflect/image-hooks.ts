import { useEffect, useRef } from 'react'
import StatusClass from '@/classes/Status'
import { Book, PageImage } from '@/types'
import { UpdateBookOptions } from '../Client'

export const useGenerateImagePrompt = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	// Update the ref whenever the page changes
	const generateImagePrompt = async () => {
		console.log('GENERATING IMAGE PROMPT for Recall and Reflect')

		const newStatus = new StatusClass(
			bookRef.current.recallAndReflect.image.prompt.status
		)
		newStatus.beginGenerating()

		// Update the book with the new status CLIENT ONLY
		updateBook(
			{
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					image: {
						...bookRef.current.recallAndReflect.image,
						prompt: {
							content:
								bookRef.current.recallAndReflect.image.prompt
									.content,
							status: newStatus.toObject(),
						},
					},
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/randr-image-prompt', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			console.log('GENERATION SUCCESS')
			console.log(data)

			updateBook(
				{
					...bookRef.current,
					recallAndReflect: {
						...bookRef.current.recallAndReflect,
						image: {
							...bookRef.current.recallAndReflect.image,
							prompt: data,
						},
					},
				},
				{
					clientOnly: true,
				}
			)
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(
				bookRef.current.recallAndReflect.image.prompt.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()

			console.log('UPDATED STATUS')
			console.log(newStatus.toObject())

			const updatedBook = {
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					image: {
						...bookRef.current.recallAndReflect.image,
						prompt: {
							content:
								bookRef.current.recallAndReflect.image.prompt
									.content,
							status: newStatus.toObject(),
						},
					},
				},
			}

			console.log('UPDATED BOOK')
			console.log(updatedBook)
			await updateBook(updatedBook, {
				clientOnly: false,
			})
		}
	}

	return {
		generateImagePrompt,
	}
}

export const useGenerateRandRImages = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateImages = async () => {
		console.log('GENERATING IMAGES for recall and reflect')

		// Update the status
		const newStatus = new StatusClass(
			bookRef.current.recallAndReflect.image.status
		)
		newStatus.beginGenerating()
		newStatus.clearMessage()

		const newBook: Book = {
			...bookRef.current,
			recallAndReflect: {
				...bookRef.current.recallAndReflect,
				image: {
					...bookRef.current.recallAndReflect.image,
					status: newStatus.toObject(),
				},
			},
		}

		console.log('GENERATING IMAGES')

		// Update the book with the new status
		await updateBook(newBook, {
			clientOnly: true,
		})

		const res = await fetch('/api/generate/randr-image', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			const newRecallAndReflect = data
			console.log('GENERATION SUCCESS')
			console.log(newRecallAndReflect)

			const newBook: Book = {
				...bookRef.current,
				recallAndReflect: newRecallAndReflect,
			}

			await updateBook(newBook, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(
				bookRef.current.recallAndReflect.image.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()
			const newBook: Book = {
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					image: {
						...bookRef.current.recallAndReflect.image,
						status: newStatus.toObject(),
					},
				},
			}
			await updateBook(newBook, {
				clientOnly: false,
			})
		}
	}

	return {
		generateImages,
	}
}

export const useUpdateRandRImages = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book,
	setNewImages: (newImages: boolean) => void
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateImages = async () => {
		console.log('UPDATING IMAGES for recall and reflect')

		const res = await fetch('/api/randrimage/update', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const images: PageImage = await res.json()

			const newRecallAndReflect = {
				...bookRef.current.recallAndReflect,
				image: images,
			}

			console.log('new recall and reflect images received')

			if (
				!images.status.generating.inProgress &&
				images.status.message.code !== 'error' &&
				images.imageOptions.length > 0
			) {
				console.log('no longer generating; job done')
				setNewImages(true)
			}

			const newBook = {
				...bookRef.current,
				recallAndReflect: newRecallAndReflect,
			}

			await updateBook(newBook, {
				clientOnly: true,
			})
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(
				book.recallAndReflect.image.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()

			const newBook = {
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					image: {
						...bookRef.current.recallAndReflect.image,
						status: newStatus.toObject(),
					},
				},
			}

			updateBook(newBook, {
				clientOnly: false,
			})
		}
	}

	return {
		updateImages,
	}
}
