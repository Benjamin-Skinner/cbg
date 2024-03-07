import React from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import { Book, Question } from '@/types'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const Questions: React.FC<Props> = ({ questions, book, updateBook }) => {
	const updateQuestion = (question: Question) => {
		const newQuestions = book.reflect.questions.map((item) => {
			if (item.id == question.id) {
				return question
			}
			return item
		})

		updateBook({
			...book,
			reflect: {
				...book.reflect,
				questions: newQuestions,
			},
		})
	}

	const deleteQuestion = (question: Question) => {
		const newQuestions = book.reflect.questions.filter(
			(item) => item.id != question.id
		)

		updateBook({
			...book,
			reflect: {
				...book.reflect,
				questions: newQuestions,
			},
		})
	}

	return (
		<Section title="reflect">
			<Section.Center>
				<div className="flex flex-col justify-center space-y-4 w-fit m-auto">
					{questions.map((question, index) => (
						<div
							className={`card w-96 bg-base-100 shadow-xl transition-all duration-300 border-2 border-transparent ${
								question.selected && 'border-green-500'
							}`}
						>
							<div className="card-body">
								<article className="prose">
									<textarea
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
												chapter {question.page}
											</div>
										)}
										<div className="flex flex-row ml-auto space-x-4">
											<div className="card-actions justify-end">
												<button
													onClick={() => {
														deleteQuestion(question)
													}}
													className="btn btn-outline btn-error"
												>
													Remove
												</button>
											</div>
											<div className="card-actions justify-end">
												<button
													onClick={() => {
														updateQuestion({
															...question,
															selected:
																!question.selected,
														})
													}}
													className="btn btn-outline btn-success"
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
				<Status status="ready" />

				<Stat
					title="Questions Selected"
					value={questions
						.filter((item) => item.selected)
						.length.toString()}
					desc="Select 5 questions total"
				/>

				<button disabled={true} className="btn btn-info btn-wide mt-12">
					Regenerate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Reflect
