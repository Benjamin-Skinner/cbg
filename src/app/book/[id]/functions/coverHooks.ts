import { useEffect, useRef } from 'react'
import { Book, Cover, ImageIdeas, PageImage } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'
import StatusClass from '@/classes/Status'

export const useGenerateImages = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book,
	cover: Cover,
	front: boolean,
	back: boolean
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)
	const coverRef = useRef(cover)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	// Update the ref whenever the page changes
	useEffect(() => {
		coverRef.current = cover
	}, [cover])

	const generateImages = async () => {
		console.log('GENERATING IMAGES for cover')

		// Update the status
		const newStatus = new StatusClass(coverRef.current.image.status)
		newStatus.beginGenerating()
		newStatus.clearMessage()

		const newBook = front
			? {
					...bookRef.current,
					frontCover: {
						...coverRef.current,
						image: {
							...coverRef.current.image,
							status: newStatus.toObject(),
						},
					},
			  }
			: {
					...bookRef.current,
					backCover: {
						...coverRef.current,
						image: {
							...coverRef.current.image,
							status: newStatus.toObject(),
						},
					},
			  }

		// Update the book with the new status
		await updateBook(newBook, {
			clientOnly: true,
		})

		const res = await fetch('/api/generate/cover', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				cover: coverRef.current,
				front: front,
				back: back,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			const newCover: Cover = data
			console.log('GENERATION SUCCESS')
			console.log(newCover)

			const newBook = front
				? {
						...bookRef.current,
						frontCover: newCover,
				  }
				: {
						...bookRef.current,
						backCover: newCover,
				  }

			await updateBook(newBook, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(coverRef.current.image.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			const newBook = front
				? {
						...bookRef.current,
						frontCover: {
							...coverRef.current,
							image: {
								...coverRef.current.image,
								status: newStatus.toObject(),
							},
						},
				  }
				: {
						...bookRef.current,
						backCover: {
							...coverRef.current,
							image: {
								...coverRef.current.image,
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

export const useUpdateImages = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book,
	cover: Cover,
	front: boolean,
	back: boolean,
	setNewImages: (newImages: boolean) => void
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)
	const coverRef = useRef(cover)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	// Update the ref whenever the cover changes
	useEffect(() => {
		coverRef.current = cover
	}, [cover])

	const updateImages = async () => {
		console.log('UPDATING IMAGES for cover')

		const res = await fetch('/api/cover/update', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				cover: cover,
				front: front,
				back: back,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const images: PageImage = await res.json()
			// console.log(images)

			const newCover = {
				...coverRef.current,
				image: images,
			}

			console.log('new cover received ')
			// console.log(newCover)

			if (
				!images.status.generating.inProgress &&
				images.status.message.code !== 'error' &&
				images.imageOptions.length > 0
			) {
				console.log('no longer generating; job done')
				setNewImages(true)
			}

			const newBook = front
				? {
						...bookRef.current,
						frontCover: newCover,
				  }
				: {
						...bookRef.current,
						backCover: newCover,
				  }

			await updateBook(newBook, {
				clientOnly: true,
			})
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(cover.image.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			const newBook = front
				? {
						...bookRef.current,
						frontCover: {
							...coverRef.current,
							image: {
								...coverRef.current.image,
								status: newStatus.toObject(),
							},
						},
				  }
				: {
						...bookRef.current,
						backCover: {
							...coverRef.current,
							image: {
								...coverRef.current.image,
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

export const useUpdateImageIdeas = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book,
	cover: Cover,
	front: boolean,
	back: boolean
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)
	const coverRef = useRef(cover)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	// Update the ref whenever the cover changes
	useEffect(() => {
		coverRef.current = cover
	}, [cover])

	const updateImageIdeas = async () => {
		const generatingStatus = new StatusClass(
			coverRef.current.imageIdeas.status
		)
		generatingStatus.beginGenerating()

		const newCover: Cover = {
			...coverRef.current,
			imageIdeas: {
				...coverRef.current.imageIdeas,
				status: generatingStatus.toObject(),
			},
		}

		const newBook = front
			? {
					...bookRef.current,
					frontCover: newCover,
			  }
			: {
					...bookRef.current,
					backCover: newCover,
			  }

		await updateBook(newBook, {
			clientOnly: true,
		})

		console.log('updating cover ideas')

		const res = await fetch('/api/generate/cover/ideas', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				cover: cover,
				front: front,
				back: back,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const { data } = await res.json()
			// console.log(data)

			const newCover: Cover = {
				...coverRef.current,
				imageIdeas: data.imageIdeas,
			}

			const newBook = front
				? {
						...bookRef.current,
						frontCover: newCover,
				  }
				: {
						...bookRef.current,
						backCover: newCover,
				  }

			await updateBook(newBook, {
				clientOnly: true,
			})
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(cover.imageIdeas.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			const newBook: Book = front
				? {
						...bookRef.current,
						frontCover: {
							...coverRef.current,
							imageIdeas: {
								...coverRef.current.imageIdeas,
								status: newStatus.toObject(),
							},
						},
				  }
				: {
						...bookRef.current,
						backCover: {
							...coverRef.current,
							imageIdeas: {
								...coverRef.current.imageIdeas,
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
		updateImageIdeas,
	}
}
