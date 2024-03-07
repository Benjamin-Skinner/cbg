'use client'
import React from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import ImageCard from '@/components/ImageCard'
import ImagePicker from '@/components/ImagePicker'
import { RefreshIcon } from '@/components/Icons'
import { Book } from '@/types'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const Frontcover: React.FC<Props> = ({ book, updateBook }) => {
	const [prompt, setPrompt] = React.useState<string>(
		'Watercolor clip art of a tiger. Hyper realistic. Naturalistic.'
	)

	const [imageIdeas, setImageIdeas] = React.useState<string[]>([
		'The Eiffel tower',
		'A globe depicting several Wonders of the World',
		'The Taj Mahal',
	])

	const newPrompt = (idea: string) => {
		setPrompt(
			`Watercolor clip art of ${idea.toLowerCase()}. hyper realistic. naturalistic.`
		)
	}

	return (
		<Section title="Front Cover">
			<Section.Center>
				<div className="card w-1/2 bg-base-100 shadow-xl m-auto">
					<div className="card-body">
						{/* <ImagePicker image={} id="frontcover" title="Front Cover" /> */}
					</div>
				</div>
			</Section.Center>
			<Section.Right>
				<Status status={book.frontCover.status} />
				<div className="space-y-2 mt-4">
					<div className="flex flex-row items-center space-x-3">
						<article className="prose">
							<h4>Image Ideas:</h4>
						</article>
						<button className="btn btn-ghost btn-sm">
							<RefreshIcon />
						</button>
					</div>
					{imageIdeas.map((idea, index) => (
						<button
							key={index}
							className="badge badge-lg border-black border-1 hover:badge-neutral hover:badge-lg hover:text-white"
							onClick={() => newPrompt(idea)}
						>
							{idea} -&gt;
						</button>
					))}
				</div>

				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="textarea h-48 w-full mt-12 leading-5"
				/>

				<button disabled={true} className="btn btn-info btn-wide mt-12">
					Regenerate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Frontcover
