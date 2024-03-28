import { Book } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import { Field } from '../Client'

const useUpdateinDB = (
	doneSaving: () => void,
	setLastSaved: Dispatch<SetStateAction<number>>,
	setWarningMessage: Dispatch<SetStateAction<string>>
) => {
	/**
	 * @function updateInDB
	 *
	 * @summary
	 * Takes the book from state and makes a PUT request to the database.
	 * On success, updates lastSaved.
	 * On failure, sets warningMessage to the error message.
	 *
	 * @param
	 *
	 * @returns
	 *
	 * @remarks
	 */
	const updateInDB = async (book: Book, fields: Field[]) => {
		console.log('UPDATING IN DATABASE')
		// Update in database
		try {
			const res = await fetch(`/api/book/${book.id}`, {
				method: 'PUT',
				body: JSON.stringify({
					book,
					fields: fields,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			// SUCCESS
			if (res.status === 200) {
				doneSaving()
				const { lastUpdated } = await res.json()
				setLastSaved(lastUpdated)
			}
			// ERROR
			else {
				const { error, code } = await res.json()
				setWarningMessage(error)
				doneSaving()
			}
		} catch (e: any) {
			setWarningMessage(e.message || 'Error saving book')
			doneSaving()
		}
	}

	return { updateInDB }
}

export default useUpdateinDB
