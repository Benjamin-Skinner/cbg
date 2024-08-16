import React, { useState } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io'
import Stat from '@/components/Stat'
import { Page, Book, TextGenerationMode } from '@/types'
import { UpdateBookOptions } from '../../Client'
import Status from '@/components/Status'
import { countWords } from '@/util/wordCount'
import useGeneratePageText from './useGeneratePageText'

interface TextProps {
	page: Page
	updatePage: (page: Page, options?: UpdateBookOptions) => void
	book: Book
	intro: boolean
	conclusion: boolean
}

const Text: React.FC<TextProps> = ({
	page,
	updatePage,
	book,
	intro,
	conclusion,
}) => {
	const [mode, setMode] = useState<TextGenerationMode>('generate')
	const { generateText } = useGeneratePageText(
		updatePage,
		book,
		page,
		intro,
		conclusion,
		mode
	)

	const cancelGeneration = () => {
		updatePage({
			...page,
			text: {
				...page.text,
				status: {
					...page.text.status,
					generating: {
						inProgress: false,
						progress: 0,
					},
				},
			},
		})
	}

	return (
		<div>
			<div className="flex flex-row mb-6">
				<Status status={page.text.status} />
				{page.text.status.generating.inProgress && (
					<button
						className="btn btn-sm btn-outline ml-6"
						onClick={cancelGeneration}
					>
						Cancel
					</button>
				)}
			</div>

			<div className="flex flex-row items-center mt-6">
				<button
					disabled={page.text.status.generating.inProgress}
					onClick={generateText}
					className="btn btn-info btn-wide"
				>
					{mode === 'generate'
						? 'Generate'
						: mode === 'add'
						? 'Add Sentence'
						: mode === 'reduce'
						? 'Reduce Words'
						: 'Edit'}
				</button>
				<div className="dropdown dropdown-bottom dropdown-end btn-info">
					<div tabIndex={0} role="button" className="btn m-1">
						<IoMdArrowDropdown />
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
					>
						<li onClick={() => setMode('generate')}>
							<a>Generate Text</a>
						</li>
						<li onClick={() => setMode('add')}>
							<a>Add Sentence</a>
						</li>
						{/* <li onClick={() => setMode('reduce')}>
							<a>Reduce Words</a>
						</li>
						<li onClick={() => setMode('edit')}>
							<a>Edit</a>
						</li> */}
					</ul>
				</div>
			</div>
			<Stat
				title="Word Count"
				value={countWords(page.text.content).toString()}
				desc={
					page.layout === 'fullPage'
						? 'Goal: 80 to 90 words'
						: 'Goal: 65 to 75 words'
				}
				error={
					(countWords(page.text.content) < 65 &&
						page.layout !== 'fullPage') ||
					(countWords(page.text.content) < 80 &&
						page.layout === 'fullPage') ||
					(countWords(page.text.content) > 90 &&
						page.layout === 'fullPage') ||
					(countWords(page.text.content) > 75 &&
						page.layout !== 'fullPage')
				}
			/>
		</div>
	)
}

export default Text
