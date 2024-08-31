'use client'
import React from 'react'
import Section from '@/components/Section'
import { Book } from '@/types'
import { BsDownload } from 'react-icons/bs'

interface Props {
	book: Book
	updateBook: (book: Book) => void
	setWarningMessage: (message: string) => void
}

const Download: React.FC<Props> = ({ book, setWarningMessage }) => {
	const [loading, setLoading] = React.useState({
		hardcoverManuscript: false,
		paperbackManuscript: false,
		backcover: false,
		frontcoverPaper: false,
		frontcoverHard: false,
	})

	const downloadManuscript = async (version: 'hard' | 'paper') => {
		if (version === 'hard') {
			setLoading({ ...loading, hardcoverManuscript: true })
		} else {
			setLoading({ ...loading, paperbackManuscript: true })
		}
		const response = await fetch(
			`/api/download/${book.id}/manuscript/${version}`
		)

		if (response.status === 200) {
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `${book.title}-${version}.docx`
			document.body.appendChild(a)
			a.click()
			a.remove()
		} else {
			const { error, code } = await response.json()
			setWarningMessage(error)
		}

		if (version === 'hard') {
			setLoading({ ...loading, hardcoverManuscript: false })
		} else {
			setLoading({ ...loading, paperbackManuscript: false })
		}
	}

	const downloadCoverAssets = async (version: 'hard' | 'paper' | 'back') => {
		if (version === 'hard') {
			setLoading({ ...loading, frontcoverHard: true })
		} else if (version === 'paper') {
			setLoading({ ...loading, frontcoverPaper: true })
		} else {
			setLoading({ ...loading, backcover: true })
		}

		const response = await fetch(
			`/api/download/${book.id}/cover/${version}`
		)
		if (response.status === 200) {
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `cover-${version}.png`
			document.body.appendChild(a)
			a.click()
			a.remove()
		} else {
			const { error, code } = await response.json()
			setWarningMessage(error)
		}

		if (version === 'hard') {
			setLoading({ ...loading, frontcoverHard: false })
		} else if (version === 'paper') {
			setLoading({ ...loading, frontcoverPaper: false })
		} else {
			setLoading({ ...loading, backcover: false })
		}
	}

	return (
		<Section title="Download">
			<Section.Center>
				<div className="flex flex-row">
					<div className="card shadow-xl bg-base-100 w-2/5 m-auto">
						<div className="card-body">
							<h1 className="text-2xl font-bold">
								Download Files
							</h1>
							<p className="text-lg">
								Download the book files below
							</p>
							<button
								onClick={() => downloadManuscript('hard')}
								className="btn btn-primary mt-4"
								disabled={loading.hardcoverManuscript}
							>
								{loading.hardcoverManuscript ? (
									<span className="loading loading-spinner loading-lg"></span>
								) : (
									<>
										{' '}
										<BsDownload size={25} />
										Download Hardcover Manuscript
									</>
								)}
							</button>
							<button
								onClick={() => downloadManuscript('paper')}
								className="btn btn-primary mt-4"
								disabled={loading.paperbackManuscript}
							>
								{loading.paperbackManuscript ? (
									<span className="loading loading-spinner loading-lg"></span>
								) : (
									<>
										<BsDownload size={25} />
										Download Paperback Manuscript
									</>
								)}
							</button>
							<button
								onClick={() => downloadCoverAssets('back')}
								className="btn btn-primary mt-4"
								disabled={loading.backcover}
							>
								{loading.backcover ? (
									<span className="loading loading-spinner loading-lg"></span>
								) : (
									<>
										<BsDownload size={25} />
										Download Back Cover
									</>
								)}
							</button>
							<button
								onClick={() => downloadCoverAssets('paper')}
								className="btn btn-primary mt-4"
								disabled={loading.frontcoverPaper}
							>
								{loading.frontcoverPaper ? (
									<span className="loading loading-spinner loading-lg"></span>
								) : (
									<>
										<BsDownload size={25} />
										Download Front Cover Paper
									</>
								)}
							</button>
							<button
								onClick={() => downloadCoverAssets('hard')}
								className="btn btn-primary mt-4"
								disabled={loading.frontcoverHard}
							>
								{loading.frontcoverHard ? (
									<span className="loading loading-spinner loading-lg"></span>
								) : (
									<>
										<BsDownload size={25} />
										Download Front Cover Hard
									</>
								)}
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
