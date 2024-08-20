'use client'
import React, { useState, useCallback, useEffect } from 'react'

import Navbar from '@/components/Navbar'
import Title from './Title'
import Backcover from './Backcover'
import Outline from './Outline'
import Pages from './Pages'
import { Book, Page } from '@/types'
import ShowWarning from './ShowWarning'
import useUpdateinDB from './functions/useUpdateInDB'
import debounce from 'lodash.debounce'
import Download from './Download'
import Blurb from './Blurb'
import RecallAndReflect from './RecallAndReflect/index'
import { getNewPageLayouts } from '@/util/calculatePageLayout'
import InsideCover from './InsideCover'
import FrontcoverHard from './FrontcoverHard'
import FrontcoverPaper from './FrontcoverPaper'
import Upload from './Upload'
import Context from './Context'

interface Props {
	bookData: Book
}

export type UpdateBookOptions = {
	clientOnly?: boolean
	fields?: Field[]
	updateLayouts?: boolean
}

export type Field = 'title' | 'description' | 'status'

const DEBOUNCE_SECONDS = 3

const Client: React.FC<Props> = ({ bookData }) => {
	// The book state
	const [book, setBook] = useState(bookData)
	// Whether a save is in progress or not
	const [saving, setSaving] = useState(false)
	// The last time the book was saved
	const [lastSaved, setLastSaved] = useState(book.lastSaved)

	// Any warning messages
	const [warningMessage, setWarningMessage] = useState('')

	// Exports the function to update the book in the database
	const { updateInDB } = useUpdateinDB(
		() => setSaving(false),
		setLastSaved,
		setWarningMessage
	)

	// Call function to update the page layouts whenever one page layout gets set to full, or the order changes

	// Debounce the updateInDB function (so it only runs every DEBOUNCE_SECONDS seconds)
	const debouncedUpdateInDB = useCallback(
		debounce(updateInDB, 1000 * DEBOUNCE_SECONDS),
		[]
	)

	// Called when the book is updated

	// useEffect(() => {
	// 	updateBook(bookData, {
	// 		updateLayouts: true,
	// 	})
	// }, [])

	const updateBook = async (book: Book, funcOptions?: UpdateBookOptions) => {
		let updatedBook = { ...book }
		const options = funcOptions || {
			clientOnly: false,
			fields: [],
			updateLayouts: false,
		}

		if (options.updateLayouts) {
			const newPageLayouts = getNewPageLayouts(book)
			updatedBook = {
				...book,
				pages: { ...book.pages, chapters: newPageLayouts },
			}
		}

		!options.clientOnly && setSaving(true)
		// Update in state
		console.log('updatedBook', updatedBook)
		setBook(updatedBook)

		// // Update in Database after DEBOUNCE_SECONDS seconds
		!options.clientOnly &&
			debouncedUpdateInDB(updatedBook, options.fields || [])
	}

	const manualSave = async () => {
		setSaving(true)
		// Update in state
		setBook(book)

		// Update in Database after DEBOUNCE_SECONDS seconds
		updateInDB(book, [])
	}

	return (
		<>
			<Navbar
				lastSaved={lastSaved}
				saving={saving}
				manualSave={manualSave}
			/>
			<ShowWarning
				warningMessage={warningMessage}
				setWarningMessage={setWarningMessage}
			/>
			<div className="lg:px-8 flex flex-col items-center pt-12 py-52">
				<Title book={book} updateBook={updateBook} />
				<Outline book={book} updateBook={updateBook} />

				<FrontcoverHard book={book} updateBook={updateBook} />
				<FrontcoverPaper book={book} updateBook={updateBook} />

				<Backcover book={book} updateBook={updateBook} />
				<InsideCover book={book} updateBook={updateBook} />

				<Blurb book={book} updateBook={updateBook} />

				<Context book={book} updateBook={updateBook} />
				<Pages book={book} updateBook={updateBook} />

				<RecallAndReflect book={book} updateBook={updateBook} />
				{/* <Recall book={book} updateBook={updateBook} />
				<Reflect book={book} updateBook={updateBook} /> */}

				<Download
					book={book}
					updateBook={updateBook}
					setWarningMessage={setWarningMessage}
				/>

				{/* <Upload
					book={book}
					updateBook={updateBook}
					setWarningMessage={setWarningMessage}
				/> */}
			</div>
		</>
	)
}

export default Client
