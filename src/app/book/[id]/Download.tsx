'use client'
import React from 'react'
import Section from '@/components/Section'
import { Book } from '@/types'

interface Props {
	book: Book
	updateBook: (book: Book) => void
	setWarningMessage: (message: string) => void
}

function bookName(title: string, version: string) {
	return `${title}-${version}`
}

const Download: React.FC<Props> = ({ book, setWarningMessage }) => {
	const downloadManuscript = async (version: 'hardcover' | 'softcover') => {
		const res = await fetch(`/api/doc/${book.id}`, {
			method: 'POST',
			body: JSON.stringify({
				version: version,
				type: 'manuscript',
			}),
		})

		if (res.status === 200) {
			console.log('Downloaded manuscript')
			console.log(res)
			const blob = await res.blob()

			// Download the file
			const url = window.URL.createObjectURL(blob)
			console.log(url)
			let link = document.createElement('a')
			link.href = url
			link.download = bookName(book.title, version) + '.docx'
			link.click()

			window.URL.revokeObjectURL(url)
			link.remove() //afterwards we remove the element
		} else {
			const { error, code } = await res.json()
			setWarningMessage(error)
		}
	}
	return (
		<Section title="Download">
			<Section.Center>
				<div className="flex flex-row">
					<div className="card shadow-xl bg-base-100 w-2/5 m-auto">
						<div className="card-body">
							<h1 className="text-2xl font-bold">Hardcover</h1>
							<p className="text-lg">
								Download the hardcover book as a PDF file.
							</p>
							<button
								onClick={() => downloadManuscript('hardcover')}
								className="btn btn-primary mt-4"
							>
								Download Manuscript
							</button>
							<button className="btn btn-primary mt-4">
								Download Cover
							</button>
						</div>
					</div>
					<div className="card shadow-xl bg-base-100 w-2/5 m-auto">
						<div className="card-body">
							<h1 className="text-2xl font-bold">Softcover</h1>
							<p className="text-lg">
								Download the softcover book as a PDF file.
							</p>
							<button
								className="btn btn-primary mt-4"
								onClick={() => downloadManuscript('softcover')}
							>
								Download Manuscript
							</button>
							<button className="btn btn-primary mt-4">
								Download Cover
							</button>
						</div>
					</div>
				</div>
			</Section.Center>
			<Section.Right></Section.Right>
		</Section>
	)
}

export default Download
