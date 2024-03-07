'use client'

import React, { useRef, useEffect } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import ImagePicker from '@/components/ImagePicker'
import { Page, Book } from '@/types'
import { countWords } from '@/util/wordCount'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from './Client'
import { handleErrorOnClient } from '@/util/handleErrorOnClient'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

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
	const [isImage, setIsImage] = React.useState<boolean>(false)

	return (
		<Section title={title}>
			<Section.Center>
				<div className="">
					{style === 'hardcover' ? (
						<div className="card w-7/12 m-auto aspect-hardcover bg-base-100 shadow-xl">
							<div className="card-body w-full">
								<div className="m-auto w-5/6 p-2 pb-8">
									<ImagePicker
										title={title}
										id="p1"
										image={page.image.image}
									/>
								</div>
								<article className="prose m-auto text-md px-6 w-full h-full">
									<textarea
										value={page.text.content}
										onChange={(e) =>
											updatePage({
												...page,
												text: {
													...page.text,
													content: e.target.value,
												},
											})
										}
										className="w-full h-full"
									/>
								</article>
							</div>
						</div>
					) : (
						<div
							className="
                    flex flex-row pr-16"
						>
							<div className="card w-2/3 aspect-softcover bg-base-100 shadow-xl">
								<div className="card-body w-full h-full flex justify-center">
									<article className="prose m-auto w-full px-6">
										<textarea
											value={page.text.content}
											onChange={(e) =>
												updatePage({
													...page,
													text: {
														...page.text,
														content: e.target.value,
													},
												})
											}
											className="w-full h-48 overflow-hidden"
										/>
									</article>
								</div>
							</div>
							<div className="card w-2/3 aspect-softcover bg-base-100 shadow-xl">
								<div className="card-body w-full">
									<div className="m-auto w-full p-2 pb-8">
										<ImagePicker
											image={page.image.image}
											title={title}
											id="p1"
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</Section.Center>
			<Section.Right>
				<div role="tablist" className="tabs tabs-boxed mb-8">
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
					<Images page={page} />
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
	const { generateText } = useGeneratePageText(
		updatePage,
		book,
		page,
		intro,
		conclusion
	)
	return (
		<div>
			<Status status={page.text.status} />

			<button
				disabled={page.text.status.generating.inProgress}
				onClick={generateText}
				className="btn btn-info btn-wide mt-12"
			>
				Regenerate
			</button>
			<Stat
				title="Word Count"
				value={countWords(page.text.content).toString()}
				desc="Goal: 65 to 75 words"
			/>
		</div>
	)
}

const useGeneratePageText = (
	updatePage: (page: Page, options: UpdateBookOptions) => void,
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
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
		console.log('GENERATING TEXT for page ' + pageRef.current.title)
		// ?
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
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated description
		if (res.status === 200) {
			const { data } = await res.json()
			console.log(data)
			console.log('GENERATION SUCCESS')

			await updatePage(data, {
				clientOnly: true,
			})
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
interface ImageProps {
	page: Page
}

const Images: React.FC<ImageProps> = ({ page }) => {
	const [imagePrompt, setImagePrompt] = React.useState<string>(
		'Watercolor clip art of a tiger. Hyper realistic. Naturalistic.'
	)
	return (
		<div>
			<Status status={page.image.status} />

			<button disabled={true} className="btn btn-info btn-wide mt-12">
				Regenerate
			</button>
			<textarea
				value={imagePrompt}
				className="textarea h-48 w-full mt-12 leading-5"
			/>
			<button className="btn btn-info btn-wide mt-12">Regenerate</button>
		</div>
	)
}
