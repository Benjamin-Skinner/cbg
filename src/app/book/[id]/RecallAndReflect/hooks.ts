import { useEffect, useRef } from 'react'
import StatusClass from '@/classes/Status'
import { Book } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

const useGenerateSection = (
	section: 'recall' | 'reflect',
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateSection = async () => {
		console.log(`generate ${section}`)

		// UPDATE STATE ON CLIENT
		const newStatus = new StatusClass(book.recallAndReflect[section].status)
		newStatus.beginGenerating()

		await updateBook(
			{
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					[section]: {
						...bookRef.current.recallAndReflect[section],
						status: newStatus.toObject(),
					},
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch(`/api/generate/${section}`, {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated content
		if (res.status === 200) {
			const { data } = await res.json()
			const newBook: Book = {
				...bookRef.current,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					[section]: data,
				},
			}
			handleGenerationSuccess(newBook, updateBook)
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)
			const newStatus = new StatusClass(
				bookRef.current.recallAndReflect[section].status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook({
				...book,
				recallAndReflect: {
					...bookRef.current.recallAndReflect,
					[section]: {
						...bookRef.current.recallAndReflect[section],
						status: newStatus.toObject(),
					},
				},
			})
		}
	}

	return {
		generateSection,
	}
}

export const useRegenerateRecall = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	const { generateSection } = useGenerateSection('recall', updateBook, book)

	return {
		generateRecall: generateSection,
	}
}

export const useGenerateReflect = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	const { generateSection } = useGenerateSection('reflect', updateBook, book)

	return {
		generateReflect: generateSection,
	}
}

// import { useEffect, useRef } from 'react'
// import StatusClass from '@/classes/Status'
// import { Book } from '@/types'
// import { UpdateBookOptions } from '@/app/book/[id]/Client'
// import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

// const useRegenerateRecall = (
// 	updateBook: (book: Book, options?: UpdateBookOptions) => void,
// 	book: Book
// ) => {
// 	// Use a ref to store the current book
// 	const bookRef = useRef(book)

// 	// Update the ref whenever the book changes
// 	useEffect(() => {
// 		bookRef.current = book
// 	}, [book])

// 	const generateRecall = async () => {
// 		console.log('generate recall')

// 		// UPDATE STATE ON CLIENT
// 		const newStatus = new StatusClass(book.recallAndReflect.recall.status)
// 		newStatus.beginGenerating()

// 		await updateBook(
// 			{
// 				...bookRef.current,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					recall: {
// 						...bookRef.current.recallAndReflect.recall,
// 						status: newStatus.toObject(),
// 					},
// 				},
// 			},
// 			{
// 				clientOnly: true,
// 			}
// 		)

// 		const res = await fetch('/api/generate/recall', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				book: book,
// 			}),
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		})

// 		// SUCCESS --> update the state with the new generated questions
// 		if (res.status === 200) {
// 			const { data } = await res.json()
// 			// console.log(data)
// 			const newBook: Book = {
// 				...bookRef.current,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					recall: data,
// 				},
// 			}
// 			// console.log(newBook)
// 			handleGenerationSuccess(newBook, updateBook)
// 		} else {
// 			const { error, code } = await res.json()
// 			console.error(`${code}: ${error}`)
// 			const newStatus = new StatusClass(
// 				bookRef.current.recallAndReflect.recall.status
// 			)
// 			newStatus.setError(error)
// 			newStatus.clearGenerating()
// 			updateBook({
// 				...book,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					recall: {
// 						...bookRef.current.recallAndReflect.recall,
// 						status: newStatus.toObject(),
// 					},
// 				},
// 			})
// 		}
// 	}

// 	return {
// 		generateRecall,
// 	}
// }

// const useGenerateReflect = (
// 	updateBook: (book: Book, options?: UpdateBookOptions) => void,
// 	book: Book
// ) => {
// 	// Use a ref to store the current book
// 	const bookRef = useRef(book)

// 	// Update the ref whenever the book changes
// 	useEffect(() => {
// 		bookRef.current = book
// 	}, [book])

// 	const generateReflect = async () => {
// 		console.log('generate reflect')

// 		// UPDATE STATE ON CLIENT
// 		const newStatus = new StatusClass(book.recallAndReflect.reflect.status)
// 		newStatus.beginGenerating()

// 		await updateBook(
// 			{
// 				...bookRef.current,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					reflect: {
// 						...bookRef.current.recallAndReflect.reflect,
// 						status: newStatus.toObject(),
// 					},
// 				},
// 			},
// 			{
// 				clientOnly: true,
// 			}
// 		)

// 		const res = await fetch('/api/generate/reflect', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				book: book,
// 			}),
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 		})

// 		// SUCCESS --> update the state with the new generated reflections
// 		if (res.status === 200) {
// 			const { data } = await res.json()
// 			const newBook: Book = {
// 				...bookRef.current,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					reflect: data,
// 				},
// 			}
// 			handleGenerationSuccess(newBook, updateBook)
// 		} else {
// 			const { error, code } = await res.json()
// 			console.error(`${code}: ${error}`)
// 			const newStatus = new StatusClass(
// 				bookRef.current.recallAndReflect.reflect.status
// 			)
// 			newStatus.setError(error)
// 			newStatus.clearGenerating()
// 			updateBook({
// 				...book,
// 				recallAndReflect: {
// 					...bookRef.current.recallAndReflect,
// 					reflect: {
// 						...bookRef.current.recallAndReflect.reflect,
// 						status: newStatus.toObject(),
// 					},
// 				},
// 			})
// 		}
// 	}

// 	return {
// 		generateReflect,
// 	}
// }
