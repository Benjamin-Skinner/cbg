'use client'

import React from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'
import Section from '@/components/Section'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Context: React.FC<Props> = ({ book, updateBook }) => {
	const updateAiContext = (aiContext: string) => {
		updateBook({ ...book, aiContext })
	}

	return (
		<Section title="(Optional) AI Context">
			<Section.Center>
				<div className="h-[500px]">
					<div className="card shadow-xl bg-base-100 w-3/4 pt-8 space-y-8 m-auto">
						<article className="prose m-auto w-full h-full">
							<textarea
								placeholder="Ex. Focus on the history of each country rather than present-day facts."
								value={book.aiContext}
								onChange={(e) =>
									updateAiContext(e.target.value)
								}
								className="w-full h-36 border-none resize-none focus:ring-0 focus:outline-none placeholder:italic"
							/>
						</article>
					</div>
				</div>
			</Section.Center>
			<Section.Right sectionName="context"></Section.Right>
		</Section>
	)
}

export default Context
