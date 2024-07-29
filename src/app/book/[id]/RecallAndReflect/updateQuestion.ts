import { useEffect, useRef } from 'react'
import { Book, Question } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

const useUpdateQuestions = (
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

export default useUpdateQuestions
