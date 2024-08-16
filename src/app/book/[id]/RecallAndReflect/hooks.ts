import { useEffect, useRef } from 'react'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '@/app/book/[id]/Client'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'
import { Book, Question } from '@/types'

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

/**
 * For manually updating the content of one of the questions
 */
export const useUpdateQuestions = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateQuestions = (
		section: 'recall' | 'reflect',
		question: Question
	) => {
		// Create newQuestions array
		let newQuestions = []

		// If the question is empty, remove it from the array
		if (question.text === '') {
			console.log(`removing ${section} question`)
			newQuestions = bookRef.current.recallAndReflect[
				section
			].questions.filter((item) => item.id !== question.id)
		}
		// Otherwise, update the question
		else {
			console.log(`updating ${section} question`)
			newQuestions = bookRef.current.recallAndReflect[
				section
			].questions.map((item) => {
				if (item.id === question.id) {
					return question
				}
				return item
			})
		}

		console.log(newQuestions)

		const updatedBook = {
			...bookRef.current,
			recallAndReflect: {
				...bookRef.current.recallAndReflect,
				[section]: {
					...bookRef.current.recallAndReflect[section],
					questions: newQuestions,
				},
			},
		}

		console.log(updatedBook)

		updateBook(updatedBook)
	}

	const updateRecall = (question: Question) => {
		updateQuestions('recall', question)
	}

	const updateReflect = (question: Question) => {
		updateQuestions('reflect', question)
	}

	const updateQuestion = (question: Question, type: 'recall' | 'reflect') => {
		if (type === 'recall') {
			console.log('updating recall')
			updateRecall(question)
		} else {
			console.log('updating reflect')
			updateReflect(question)
		}
	}

	return {
		updateQuestion,
	}
}
