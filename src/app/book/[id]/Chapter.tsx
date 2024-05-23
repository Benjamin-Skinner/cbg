'use client'

import React, { useRef, useEffect, useState } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import ImagePicker from '@/components/ImagePicker'
import { Page, Book, PageImage } from '@/types'
import { countWords } from '@/util/wordCount'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from './Client'
import { useInterval } from 'usehooks-ts'
import { IMAGE_POLL_TIME } from '@/constants'

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
	const [newImages, setNewImages] = useState(false)
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
										page={page}
										bookId={book.id}
										updatePage={updatePage}
										newImages={newImages}
										setNewImages={setNewImages}
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
											newImages={newImages}
											page={page}
											bookId={book.id}
											updatePage={updatePage}
											setNewImages={setNewImages}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</Section.Center>
			<Section.Right sectionName="page">
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
					<Images
						page={page}
						updatePage={updatePage}
						book={book}
						intro={intro}
						conclusion={conclusion}
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
			<Status section="text" status={page.text.status} />

			<button
				disabled={page.text.status.generating.inProgress}
				onClick={generateText}
				className="btn btn-info btn-wide mt-12"
			>
				Generate
			</button>
			<Stat
				title="Word Count"
				value={countWords(page.text.content).toString()}
				desc="Goal: 65 to 75 words"
				error={
					countWords(page.text.content) < 65 ||
					countWords(page.text.content) > 75
				}
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
interface ImageProps {
	page: Page
	updatePage: (page: Page, options?: UpdateBookOptions) => void
	book: Book
	intro: boolean
	conclusion: boolean
	newImages: boolean
	setNewImages: (newImages: boolean) => void
}

const Images: React.FC<ImageProps> = ({
	page,
	updatePage,
	book,
	intro,
	conclusion,
	newImages,
	setNewImages,
}) => {
	const { generateImagePrompt } = useGenerateImagePrompt(
		updatePage,
		book,
		page,
		intro,
		conclusion
	)

	const { generateImages } = useGenerateImages(
		updatePage,
		book,
		page,
		intro,
		conclusion
	)

	const { updateImages } = useUpdateImages(
		updatePage,
		book,
		page,
		intro,
		conclusion,
		setNewImages
	)

	const cancelGeneration = async () => {
		const newStatus = new StatusClass(page.image.status)
		newStatus.clearGenerating()
		updatePage({
			...page,
			image: {
				...page.image,
				status: newStatus.toObject(),
			},
		})
	}

	useInterval(
		() => {
			// Your custom logic here
			if (page.image.status.generating.inProgress) {
				console.log(`Polling for images for page ${page.title}`)
				updateImages()
			} else {
				console.log('No generating images')
			}
		},
		// Delay in milliseconds or null to stop it
		IMAGE_POLL_TIME * 1000
	)

	return (
		<div>
			<div className="flex flex-row items-center">
				<Status status={page.image.status} image />
				{page.image.status.generating.inProgress && (
					<button
						className="btn btn-sm btn-outline ml-6"
						onClick={cancelGeneration}
					>
						Cancel
					</button>
				)}
			</div>

			<button
				onClick={generateImagePrompt}
				className="btn btn-info btn-wide mt-12"
				disabled={
					page.image.status.generating.inProgress ||
					page.image.prompt.status.generating.inProgress
				}
			>
				{page.image.prompt.status.generating.inProgress ? (
					<span className="loading loading-dots loading-md"></span>
				) : (
					'Generate Prompt'
				)}
			</button>

			<textarea
				disabled={
					page.image.status.generating.inProgress ||
					page.image.prompt.status.generating.inProgress
				}
				value={page.image.prompt.content}
				onChange={(e) =>
					updatePage({
						...page,
						image: {
							...page.image,
							prompt: {
								...page.image.prompt,
								content: e.target.value,
							},
						},
					})
				}
				className="textarea h-48 w-full mt-12 leading-5"
			/>
			<button
				disabled={
					page.image.status.generating.inProgress ||
					page.image.status.generating.inProgress
				}
				onClick={generateImages}
				className="btn btn-info btn-wide mt-12"
			>
				Generate Images
			</button>
		</div>
	)
}

const useGenerateImagePrompt = (
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

	const generateImagePrompt = async () => {
		console.log('GENERATING IMAGE PROMPT for page ' + pageRef.current.title)
		// ?
		const newStatus = new StatusClass(pageRef.current.image.prompt.status)
		newStatus.beginGenerating()

		// Update the book with the new status
		updatePage(
			{
				...pageRef.current,
				image: {
					...pageRef.current.image,
					prompt: {
						content: pageRef.current.image.prompt.content,
						status: newStatus.toObject(),
					},
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/image-prompt', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				page: pageRef.current,
				intro: intro,
				conclusion: conclusion,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			console.log('GENERATION SUCCESS')

			await updatePage(data, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(
				pageRef.current.image.prompt.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()
			await updatePage(
				{
					...pageRef.current,
					image: {
						...pageRef.current.image,
						prompt: {
							content: pageRef.current.image.prompt.content,
							status: newStatus.toObject(),
						},
					},
				},
				{
					clientOnly: false,
				}
			)
		}
	}

	return {
		generateImagePrompt,
	}
}

const useGenerateImages = (
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

	const generateImages = async () => {
		console.log('GENERATING IMAGES for page ' + pageRef.current.title)
		// ?
		const newStatus = new StatusClass(pageRef.current.image.status)
		newStatus.beginGenerating()

		// Update the book with the new status
		await updatePage(
			{
				...pageRef.current,
				image: {
					...pageRef.current.image,
					status: newStatus.toObject(),
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/image', {
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

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			console.log('GENERATION SUCCESS')
			console.log(data)

			await updatePage(data, {
				clientOnly: true,
			})
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(pageRef.current.image.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			await updatePage(
				{
					...pageRef.current,
					image: {
						...pageRef.current.image,
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
		generateImages,
	}
}

const useUpdateImages = (
	updatePage: (page: Page, options: UpdateBookOptions) => void,
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean,
	setNewImages: (newImages: boolean) => void
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

	const updateImages = async () => {
		console.log('UPDATING IMAGES for page ' + page.title)

		const res = await fetch('/api/image/update', {
			method: 'POST',
			body: JSON.stringify({
				page: page,
				intro: intro,
				conclusion: conclusion,
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new images
		if (res.status === 200) {
			const images: PageImage = await res.json()
			console.log(images)

			const newPage = {
				...pageRef.current,
				image: images,
			}

			if (
				!images.status.generating.inProgress &&
				images.status.message.code !== 'error' &&
				images.imageOptions.length > 0
			) {
				console.log('no longer generating; job done. STATUS:')
				console.log(images.status)
				setNewImages(true)
			}

			console.log('new page received ')
			console.log(newPage)

			await updatePage(newPage, {
				clientOnly: true,
			})
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(page.image.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			await updatePage(
				{
					...pageRef.current,
					image: {
						...pageRef.current.image,
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
		updateImages,
	}
}
