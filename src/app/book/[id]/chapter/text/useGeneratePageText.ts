import React, { useRef, useEffect, useState } from 'react'
import { Page, Book, PageImage, TextGenerationMode } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from '../../Client'

const useGeneratePageText = (
	updatePage: (page: Page, options: UpdateBookOptions) => void,
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean,
	mode: TextGenerationMode
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)
	const pageRef = useRef(page)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	// Update the ref whenever the page changes
	useEffect(() => {
		pageRef.current = page
	}, [page])

	const generateText = async () => {
		const newStatus = new StatusClass(pageRef.current.text.status)
		newStatus.beginGenerating()

		// Update the book with the new status
		await updatePage(
			{
				...pageRef.current,
				text: {
					...pageRef.current.text,
					status: newStatus.toObject(),
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/text', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				page: page,
				intro: intro,
				conclusion: conclusion,
				mode: mode,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated text
		if (res.status === 200) {
			const data = await res.json()
			const page: Page = data.data
			console.log('GENERATION SUCCESS')
			console.log(page)

			await updatePage(
				{
					...pageRef.current,
					text: page.text,
				},
				{
					clientOnly: true,
				}
			)
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(pageRef.current.text.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updatePage(
				{
					...pageRef.current,
					text: {
						...pageRef.current.text,
						status: newStatus.toObject(),
					},
				},
				{
					clientOnly: false,
				}
			)
		}
	}

	return {
		generateText,
	}
}

export default useGeneratePageText
