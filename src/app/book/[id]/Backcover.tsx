'use client'
import React, { useEffect, useState, useRef } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import { Book, Cover, PageImage } from '@/types'
import BackCoverImagePicker from '@/components/selectImage/BackCoverImagePicker'
import { IMAGE_POLL_TIME } from '@/constants'
import { useInterval } from 'usehooks-ts'
import { useGenerateImages, useUpdateImages } from './functions/coverHooks'
import SelectImage from '@/components/selectImage/SelectImage'
import { UpdateBookOptions } from './Client'
import StatusClass from '@/classes/Status'
import { RefreshIcon } from '@/components/Icons'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const Backcover: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)
	const [view, setView] = useState<'image' | 'hard' | 'paper'>('image')

	const { generateImagePrompt } = useGenerateImagePrompt(updateBook, book)

	const { generateImages } = useGenerateImages(
		updateBook,
		book,
		book.backCover,
		false,
		true,
		setNewImages
	)

	const { updateImages } = useUpdateImages(
		updateBook,
		book,
		book.backCover,
		false,
		true,
		setNewImages
	)

	const cancelGeneration = () => {
		console.log('Cancelling image generation')
		updateBook({
			...book,
			backCover: {
				...book.backCover,
				image: {
					...book.backCover.image,
					status: {
						...book.backCover.image.status,
						generating: {
							inProgress: false,
							progress: 0,
						},
					},
				},
			},
		})
	}

	useInterval(
		() => {
			// Your custom logic here
			if (book.backCover.image.status.generating.inProgress) {
				console.log(`Polling for images for page front cover`)
				updateImages()
			}
		},
		// Delay in milliseconds or null to stop it
		IMAGE_POLL_TIME * 1000
	)

	const styles = {
		outer: {
			image: 'card w-2/3 aspect-square bg-base-100 shadow-xl m-auto',
			hard: 'card w-2/3 aspect-hardcover bg-base-100 shadow-xl m-auto',
			paper: 'card w-2/3 aspect-square bg-base-100 shadow-xl m-auto',
		},
		inner: {
			image: 'card-body h-full flex items-center justify-center',
			hard: 'h-full  items-center justify-center',
			paper: 'card-body h-full flex items-center justify-center',
		},
	}

	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook({
			...book,
			backCover: {
				...book.backCover,
				image,
			},
		})
	}

	return (
		<Section title="Back Cover">
			<Section.Center>
				<SelectImage
					image={book.backCover.image}
					updateImage={updateImage}
					modalId="backCover"
					bookId={book.id}
				/>
				{/* <div className="flex items-center flex-row space-x-5 justify-center mb-4">
					<div className="form-control">
						<label className="label cursor-pointer space-x-2">
							<span className="label-text">Plain Image</span>
							<input
								type="radio"
								name="radio-10"
								className="radio"
								checked={view === 'image'}
								onChange={() => setView('image')}
							/>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer space-x-2">
							<span className="label-text">Hardcover</span>
							<input
								type="radio"
								name="radio-10"
								className="radio"
								checked={view === 'hard'}
								onChange={() => setView('hard')}
							/>
						</label>
					</div>
					<div className="form-control">
						<label className="label cursor-pointer space-x-2">
							<span className="label-text">Paperback</span>
							<input
								type="radio"
								name="radio-10"
								className="radio"
								checked={view === 'paper'}
								onChange={() => setView('paper')}
							/>
						</label>
					</div>
				</div>
				<div className={styles.outer[view]}>
					<div className={styles.inner[view]}>
						<BackCoverImagePicker
							view={view}
							cover={book.backCover}
							book={book}
							updateCover={(cover: Cover) => {
								updateBook({
									...book,
									backCover: cover,
								})
							}}
							newImages={newImages}
							setNewImages={setNewImages}
						/>
					</div>
				</div> */}
			</Section.Center>
			<Section.Right sectionName="backcover">
				<div className="flex flex-row">
					<Status
						section="backcover"
						status={book.backCover.image.status}
						image
					/>
					{book.backCover.image.status.generating.inProgress && (
						<button
							className="btn btn-sm btn-outline ml-6"
							onClick={cancelGeneration}
						>
							Cancel
						</button>
					)}
				</div>
				{/* <div className="space-y-2 mt-4">
					<div className="flex flex-row items-center space-x-3">
						<article className="prose">
							<h4>Image Ideas:</h4>
						</article>
						<button className="btn btn-ghost btn-sm">
							<RefreshIcon />
						</button>
					</div>
					{imageIdeas.map((idea, index) => (
						<button
							key={index}
							className="badge badge-lg border-black border-1 hover:badge-neutral hover:badge-lg hover:text-white"
							onClick={() => newPrompt(idea)}
						>
							{idea} -&gt;
						</button>
					))}
				</div> */}

				<div className="space-y-2 mt-4">
					<div className="flex flex-row items-center space-x-3">
						<article className="prose">
							<h4>Image Prompt:=</h4>
						</article>
						<button
							className="btn btn-ghost btn-sm"
							onClick={generateImagePrompt}
						>
							{book.backCover.image.prompt.status.generating
								.inProgress ? (
								<span className="loading loading-dots loading-md"></span>
							) : (
								<RefreshIcon />
							)}
						</button>
					</div>
				</div>

				<textarea
					value={book.backCover.image.prompt.content}
					disabled={book.backCover.image.status.generating.inProgress}
					onChange={(e) =>
						updateBook({
							...book,
							backCover: {
								...book.backCover,
								image: {
									...book.backCover.image,
									prompt: {
										...book.backCover.image.prompt,
										content: e.target.value,
									},
								},
							},
						})
					}
					className="textarea h-48 w-full mt-12 leading-5"
				/>

				<button
					disabled={book.backCover.image.status.generating.inProgress}
					onClick={generateImages}
					className="btn btn-info btn-wide mt-12"
				>
					Generate Images
				</button>
				{/* <button
					onClick={updateImages}
					className="btn btn-info btn-wide mt-12"
				>
					Update Images
				</button> */}
			</Section.Right>
		</Section>
	)
}

export default Backcover

const useGenerateImagePrompt = (
	updateBook: (book: Book, options: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateImagePrompt = async () => {
		console.log('GENERATING IMAGE PROMPT for back cover')
		// ?
		const newStatus = new StatusClass(
			bookRef.current.backCover.image.prompt.status
		)
		newStatus.beginGenerating()

		// Update the book with the new status
		updateBook(
			{
				...bookRef.current,
				backCover: {
					...bookRef.current.backCover,
					image: {
						...bookRef.current.backCover.image,
						prompt: {
							...bookRef.current.backCover.image.prompt,
							status: newStatus.toObject(),
						},
					},
				},
			},
			{
				clientOnly: true,
			}
		)

		const res = await fetch('/api/generate/back-cover/image-prompt', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated prompt
		if (res.status === 200) {
			const { data } = await res.json()
			console.log('GENERATION SUCCESS')

			await updateBook(
				{
					...book,
					backCover: data,
				},
				{
					clientOnly: true,
				}
			)
		} else {
			console.log('GENERATION ERROR')
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)

			const newStatus = new StatusClass(
				bookRef.current.backCover.image.prompt.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook(
				{
					...bookRef.current,
					backCover: {
						...bookRef.current.backCover,
						image: {
							...bookRef.current.backCover.image,
							prompt: {
								...bookRef.current.backCover.image.prompt,
								status: newStatus.toObject(),
							},
						},
					},
				},
				{
					clientOnly: true,
				}
			)
		}
	}

	return {
		generateImagePrompt,
	}
}
