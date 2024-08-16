'use client'

import { Recall, Reflect } from './Questions'
import { Book } from '@/types'
import Section from '@/components/Section'
import { Question } from '@/types'
import React from 'react'
import {
	useGenerateReflect,
	useRegenerateRecall,
	useUpdateQuestions,
} from './hooks'
import Images from './Images'
import SelectImage from '@/components/selectImage/SelectImage'
import { PageImage } from '@/types'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

interface SelectProps {
	id: string
}

const RecallAndReflect: React.FC<Props> = ({ book, updateBook }) => {
	const [page, setPage] = React.useState<'recall' | 'reflect' | 'image'>(
		'recall'
	)

	const [newImages, setNewImages] = React.useState(false)

	const { generateRecall } = useRegenerateRecall(updateBook, book)
	const { generateReflect } = useGenerateReflect(updateBook, book)

	const updateImage = (image: PageImage) => {
		updateBook({
			...book,
			recallAndReflect: {
				...book.recallAndReflect,
				image,
			},
		})
	}

	const Select: React.FC<SelectProps> = ({ id }) => {
		return (
			<SelectImage
				setNewImages={setNewImages}
				image={book.recallAndReflect.image}
				updateImage={updateImage}
				modalId={`recallAndReflect-${id}`}
				bookId={book.id}
				newImages={newImages}
			/>
		)
	}

	return (
		<Section title="Recall and Reflect">
			<Section.Center>
				<div className="flex flex-row w-full px-6">
					<QuestionPage
						questions={book.recallAndReflect.recall.questions}
						type="recall"
						disabled={
							book.recallAndReflect.recall.status.generating
								.inProgress
						}
						book={book}
						updateBook={updateBook}
						setNewImages={setNewImages}
						image={book.recallAndReflect.image}
						updateImage={updateImage}
						modalId="recallAndReflect1"
						bookId={book.id}
						newImages={newImages}
					/>
					<QuestionPage
						questions={book.recallAndReflect.reflect.questions}
						type="reflect"
						disabled={
							book.recallAndReflect.reflect.status.generating
								.inProgress
						}
						book={book}
						updateBook={updateBook}
						setNewImages={setNewImages}
						image={book.recallAndReflect.image}
						updateImage={updateImage}
						modalId="recallAndReflect2"
						bookId={book.id}
						newImages={newImages}
					/>
				</div>
			</Section.Center>
			<Section.Right>
				<div role="tablist" className="tabs tabs-boxed my-8">
					<button
						onClick={() => setPage('recall')}
						role="tab"
						className={`tab ${
							page === 'recall' && 'tab-active'
						} transition-all duration-250 `}
					>
						Recall
					</button>
					<button
						onClick={() => setPage('reflect')}
						role="tab"
						className={`tab ${
							page === 'reflect' && 'tab-active'
						} transition-all duration-250`}
					>
						Reflect
					</button>
					<button
						onClick={() => setPage('image')}
						role="tab"
						className={`tab ${
							page === 'image' && 'tab-active'
						} transition-all duration-250`}
					>
						Image
					</button>
				</div>
				{page === 'image' ? (
					<Images
						book={book}
						updateBook={updateBook}
						setNewImages={setNewImages}
					/>
				) : page === 'recall' ? (
					<Recall book={book} generateQuestions={generateRecall} />
				) : (
					<Reflect book={book} generateQuestions={generateReflect} />
				)}
			</Section.Right>
		</Section>
	)
}

export default RecallAndReflect

interface QuestionPageProps {
	questions: Question[]
	type: 'recall' | 'reflect'
	disabled: boolean
	book: Book
	updateBook: (book: Book) => void
	setNewImages: (newImages: boolean) => void
	image: PageImage
	updateImage: (image: PageImage) => void
	modalId: string
	bookId: string
	newImages: boolean
}

const QuestionPage: React.FC<QuestionPageProps> = ({
	questions,
	type,
	disabled,
	book,
	updateBook,
	setNewImages,
	image,
	updateImage,
	modalId,
	bookId,
	newImages,
}) => {
	const { updateQuestion } = useUpdateQuestions(updateBook, book)

	return (
		<div className="card w-7/12 m-auto aspect-hardcover bg-base-100 shadow-xl">
			<h3 className="comfortaa text-3xl text-center mt-12 mb-12">
				{type === 'recall' ? 'Recall' : 'Reflect'}
			</h3>
			<div className="grid grid-cols-1 gap-4">
				{questions.map((question) => (
					<div key={question.id} className="h-min">
						<div className="">
							<article className="prose">
								<textarea
									disabled={disabled}
									value={question.text}
									className="w-full lam-anh text-center text-xl px-8 h-min py-0 my-0 flex items-center justify-center"
									onChange={(e) =>
										updateQuestion(
											{
												...question,
												text: e.target.value,
											},
											type
										)
									}
								/>
							</article>
							<div></div>
						</div>
					</div>
				))}
			</div>
			<div className="flex-1 flex items-end justify-end">
				<SelectImage
					setNewImages={setNewImages}
					image={image}
					updateImage={updateImage}
					modalId={modalId}
					bookId={bookId}
					newImages={newImages}
				/>
			</div>
		</div>
	)
}
