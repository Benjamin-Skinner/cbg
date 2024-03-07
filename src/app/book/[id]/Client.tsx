'use client'
import React, { useState, useCallback } from 'react'

import Navbar from '@/components/Navbar'
import Description from './Description'
import Title from './Title'
import Recall from './Recall'
import Reflect from './Reflect'
import Frontcover from './Frontcover'
import Backcover from './Backcover'
import Outline from './Outline'
import Pages from './Pages'
import { Book } from '@/types'
import ShowWarning from './ShowWarning'
import useUpdateinDB from './functions/useUpdateInDB'
import debounce from 'lodash.debounce'

interface Props {
	bookData: Book
}

export type UpdateBookOptions = {
	clientOnly: boolean
}

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

	// Debounce the updateInDB function (so it only runs every DEBOUNCE_SECONDS seconds)
	const debouncedUpdateInDB = useCallback(
		debounce(updateInDB, 1000 * DEBOUNCE_SECONDS),
		[]
	)

	// Called when the book is updated
	const updateBook = async (book: Book, funcOptions?: UpdateBookOptions) => {
		console.log('UPDATING BOOK')
		const options = funcOptions || { clientOnly: false }

		!options.clientOnly && setSaving(true)
		// Update in state
		setBook(book)

		// // Update in Database after DEBOUNCE_SECONDS seconds
		!options.clientOnly && debouncedUpdateInDB(book)
	}

	const manualSave = async () => {
		setSaving(true)
		// Update in state
		setBook(book)

		// Update in Database after DEBOUNCE_SECONDS seconds
		updateInDB(book)
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
			<div className="px-8 flex flex-col items-center pt-12">
				<Title book={book} updateBook={updateBook} />

				<Description book={book} updateBook={updateBook} />
				<Outline book={book} updateBook={updateBook} />

				<Pages book={book} updateBook={updateBook} />

				<Recall book={book} updateBook={updateBook} />
				<Reflect book={book} updateBook={updateBook} />

				<Frontcover book={book} updateBook={updateBook} />
				<Backcover book={book} updateBook={updateBook} />
			</div>
		</>
	)
}

export default Client
