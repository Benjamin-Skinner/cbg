'use client'
import React, { useEffect, useState } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import { Book, Cover, PageImage } from '@/types'
import CoverImagePicker from '@/components/CoverImagePicker'
import { UpdateBookOptions } from '@/app/book/[id]/Client'
import StatusClass from '@/classes/Status'
import { IMAGE_POLL_TIME } from '@/constants'
import { useInterval } from 'usehooks-ts'
import { useGenerateImages, useUpdateImages } from './functions/coverHooks'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const Backcover: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)
	const { generateImages } = useGenerateImages(
		updateBook,
		book,
		book.backCover,
		false,
		true
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

	return (
		<Section title="Back Cover">
			<Section.Center>
				<div className="card w-2/3 aspect-square bg-base-100 shadow-xl m-auto">
					<div className="card-body h-full flex items-center justify-center">
						<CoverImagePicker
							backcover
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
				</div>
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
