'use client'

import React, { useRef, useEffect, useState } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import { Page, Book, PageImage, TextGenerationMode } from '@/types'
import { countWords } from '@/util/wordCount'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '../Client'
import { useInterval } from 'usehooks-ts'
import { IMAGE_POLL_TIME } from '@/constants'
import SelectPageLayout from '@/components/SelectPageLayout'
import PageContent from '@/components/PageContent'
import { IoMdArrowDropdown } from 'react-icons/io'

import Text from './text/Text'
import Images from './image/Image'

interface Props {
	style: 'hardcover' | 'softcover'
	page: Page
	title: string
	updatePage: (page: Page, options?: UpdateBookOptions) => void
	book: Book
	intro?: boolean // if this page is the intro
	conclusion?: boolean // if this page is the conclusion
}

const Chapter: React.FC<Props> = ({
	style,
	page,
	title,
	updatePage,
	book,
	intro = false,
	conclusion = false,
}) => {
	const [newImages, setNewImages] = useState<boolean>(false)
	const [isImage, setIsImage] = React.useState<boolean>(false)

	return (
		<Section title={title}>
			<Section.Center>
				<PageContent
					page={page}
					updatePage={updatePage}
					book={book}
					newImages={newImages}
					setNewImages={setNewImages}
				/>
			</Section.Center>
			<Section.Right sectionName="page">
				{!intro && !conclusion && (
					<SelectPageLayout page={page} updatePage={updatePage} />
				)}
				<div role="tablist" className="tabs tabs-boxed my-8">
					<button
						onClick={() => setIsImage(false)}
						role="tab"
						className={`tab ${
							!isImage && 'tab-active'
						} transition-all duration-250 `}
					>
						Text
					</button>
					<button
						onClick={() => setIsImage(true)}
						role="tab"
						className={`tab ${
							isImage && 'tab-active'
						} transition-all duration-250`}
					>
						Images
					</button>
				</div>
				{isImage ? (
					<Images
						page={page}
						updatePage={updatePage}
						book={book}
						newImages={newImages}
						setNewImages={setNewImages}
					/>
				) : (
					<Text
						page={page}
						updatePage={updatePage}
						book={book}
						intro={intro}
						conclusion={conclusion}
					/>
				)}
			</Section.Right>
		</Section>
	)
}

export default Chapter
