import React, { useState } from 'react'
import { Book } from '@/types'
import Status from '@/components/Status'
import {
	useGenerateImagePrompt,
	useGenerateRandRImages,
	useUpdateRandRImages,
} from './image-hooks'
import { IMAGE_POLL_TIME } from '@/constants'
import { useInterval } from 'usehooks-ts'

interface Props {
	book: Book
	updateBook: (book: Book) => void
	setNewImages: (newImages: boolean) => void
}

const Images: React.FC<Props> = ({ book, updateBook, setNewImages }) => {
	const { generateImagePrompt } = useGenerateImagePrompt(updateBook, book)
	const { generateImages } = useGenerateRandRImages(updateBook, book)
	const { updateImages } = useUpdateRandRImages(
		updateBook,
		book,
		setNewImages
	)

	useInterval(
		() => {
			// Your custom logic here
			if (book.recallAndReflect.image.status.generating.inProgress) {
				console.log(`Polling for images for page front cover`)
				updateImages()
			}
		},
		// Delay in milliseconds or null to stop it
		IMAGE_POLL_TIME * 1000
	)

	const cancelGeneration = () => {
		updateBook({
			...book,
			recallAndReflect: {
				...book.recallAndReflect,
				image: {
					...book.recallAndReflect.image,
					status: {
						...book.recallAndReflect.image.status,
						generating: {
							progress: 0,
							inProgress: false,
						},
					},
				},
			},
		})
	}

	return (
		<div>
			<div className="flex flex-row items-center">
				<Status status={book.recallAndReflect.image.status} image />
				{book.recallAndReflect.image.status.generating.inProgress && (
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
					book.recallAndReflect.image.status.generating.inProgress ||
					book.recallAndReflect.image.prompt.status.generating
						.inProgress
				}
			>
				{book.recallAndReflect.image.prompt.status.generating
					.inProgress ? (
					<span className="loading loading-dots loading-md"></span>
				) : (
					'Generate Prompt'
				)}
			</button>

			<textarea
				disabled={
					book.recallAndReflect.image.status.generating.inProgress ||
					book.recallAndReflect.image.prompt.status.generating
						.inProgress
				}
				value={book.recallAndReflect.image.prompt.content}
				onChange={(e) =>
					updateBook({
						...book,
						recallAndReflect: {
							...book.recallAndReflect,
							image: {
								...book.recallAndReflect.image,
								prompt: {
									...book.recallAndReflect.image.prompt,
									content: e.target.value,
								},
							},
						},
					})
				}
				className="textarea h-48 w-full mt-12 leading-5"
			/>
			<button
				disabled={
					book.recallAndReflect.image.status.generating.inProgress ||
					book.recallAndReflect.image.status.generating.inProgress
				}
				onClick={generateImages}
				className="btn btn-info btn-wide mt-12"
			>
				Generate Images
			</button>
		</div>
	)
}

export default Images
