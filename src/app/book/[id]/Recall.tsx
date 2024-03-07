import React from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import { Book, Question } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from './Client'
import { useEffect, useRef } from 'react'
import { handleErrorOnClient } from '@/util/handleErrorOnClient'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}
const Recall: React.FC<Props> = ({ book, updateBook }) => {
	const updateQuestion = (question: Question) => {
		const newQuestions = book.recall.questions.map((item) => {
			if (item.id == question.id) {
				return question
			}
			return item
		})

		updateBook({
			...book,
			recall: {
				...book.recall,
				questions: newQuestions,
			},
		})
	}

	const deleteQuestion = (question: Question) => {
		const newQuestions = book.recall.questions.filter(
			(item) => item.id != question.id
		)

		updateBook({
			...book,
			recall: {
				...book.recall,
				questions: newQuestions,
			},
		})
	}

	const { generateRecall } = useRegenerateRecall(updateBook, book)

	return (
		<Section title="Recall">
			<Section.Center>
				<div className="flex flex-col justify-center space-y-4 w-fit m-auto">
					{book.recall.questions.map((question, index) => (
						<div
							className={`card w-96 bg-base-100 shadow-xl transition-all duration-300 border-2 ${
								question.selected && 'border-green-600'
							}`}
						>
							<div className="card-body pt-8 pb-4">
								<article className="prose">
									<textarea
										disabled={
											book.recall.status.generating
												.inProgress
										}
										value={question.text}
										className="w-full"
										onChange={(e) =>
											updateQuestion({
												...question,
												text: e.target.value,
											})
										}
									/>
								</article>
								<div>
									<div className="flex flex-row items-center">
										{question.fromPage && (
											<div className="badge badge-outline badge-default">
												page {question.page}
											</div>
										)}
										<div className="flex flex-row ml-auto space-x-4">
											<div className="card-actions justify-end">
												<button
													disabled={
														book.recall.status
															.generating
															.inProgress
													}
													onClick={() => {
														deleteQuestion(question)
													}}
													className="btn btn-sm btn-outline btn-error"
												>
													Delete
												</button>
											</div>
											<div className="card-actions justify-end">
												<button
													disabled={
														book.recall.status
															.generating
															.inProgress
													}
													onClick={() => {
														updateQuestion({
															...question,
															selected:
																!question.selected,
														})
													}}
													className="btn btn-sm btn-outline btn-success"
												>
													{question.selected
														? 'Deselect'
														: 'Select'}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Section.Center>
			<Section.Right>
				<Status status={book.recall.status} />

				<Stat
					title="Questions Selected"
					value={book.recall.questions
						.filter((item) => item.selected)
						.length.toString()}
					desc="Select 5 questions total"
				/>
				{/* <div className="mt-4">
					<article className="prose pb-2">
						<h4>Include Chapters:</h4>
					</article>
					<div className="w-fit grid grid-cols-3 gap-2 items-center justify-center">
						{book.pages.chapters.map((page) => (
							<button className="badge bg-transparent border-black border-1 hover:badge-neutral hover:text-white">
								{page.title}
							</button>
						))}
					</div>
				</div> */}

				<button
					disabled={book.recall.status.generating.inProgress}
					onClick={generateRecall}
					className="btn btn-info btn-wide mt-12"
				>
					Generate More
				</button>
			</Section.Right>
		</Section>
	)
}

export default Recall

const useRegenerateRecall = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateRecall = async () => {
		console.log('generate recall')

		// UPDATE STATE ON CLIENT
		const newStatus = new StatusClass(book.recall.status)
		newStatus.beginGenerating()

		await updateBook(
			{
				...bookRef.current,
				recall: {
					...bookRef.current.recall,
					status: newStatus.toObject(),
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/recall', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated description
		if (res.status === 200) {
			const { data } = await res.json()
			const newBook: Book = {
				...bookRef.current,
				recall: data,
			}
			handleGenerationSuccess(newBook, updateBook)
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)
			const newStatus = new StatusClass(bookRef.current.recall.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook({
				...book,
				recall: {
					...book.recall,
					status: newStatus.toObject(),
				},
			})
		}
	}

	return {
		generateRecall,
	}
}
