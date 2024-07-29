import React from 'react'
import { RandR, Book } from '@/types'
import Status from '@/components/Status'
import Stat from '@/components/Stat'

interface Props {
	generateQuestions: () => void
	label: 'Recall' | 'Reflect'
	section: RandR
}

const QuestionSection: React.FC<Props> = ({
	generateQuestions,
	label,
	section,
}) => {
	return (
		<div>
			<Status status={section.status} />

			<Stat
				title={label}
				error={section.questions.length !== 5}
				value={section.questions.length.toString()}
				desc="of 5"
			/>

			<button
				disabled={section.status.generating.inProgress}
				onClick={generateQuestions}
				className="btn btn-info btn-wide mt-12"
			>
				Generate {label}
			</button>
		</div>
	)
}

interface SectionProps {
	book: Book
	generateQuestions: () => void
}

export const Recall: React.FC<SectionProps> = ({ book, generateQuestions }) => {
	return (
		<QuestionSection
			generateQuestions={generateQuestions}
			label="Recall"
			section={book.recallAndReflect.recall}
		/>
	)
}

export const Reflect: React.FC<SectionProps> = ({
	book,
	generateQuestions,
}) => {
	return (
		<QuestionSection
			generateQuestions={generateQuestions}
			label="Reflect"
			section={book.recallAndReflect.reflect}
		/>
	)
}
