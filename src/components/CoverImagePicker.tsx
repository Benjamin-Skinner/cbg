'use client'

import React, { useEffect, useRef, useState } from 'react'
import { UploadIcon, XIcon } from './Icons'
import ImageCard from './ImageCard'
import ImageDisplay from './ImageDisplay'
import type { PutBlobResult } from '@vercel/blob'
import { Cover, Book } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	cover: Cover
	book: Book
	backcover?: boolean
	updateCover: (cover: Cover, options?: UpdateBookOptions) => void
	newImages: boolean
	setNewImages: (newImages: boolean) => void
}

const CoverImagePicker: React.FC<Props> = ({
	cover,
	book,
	updateCover,
	backcover = false,
	newImages,
	setNewImages,
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [currImageOptions, setCurrImageOptions] = useState(
		cover.image.imageOptions
	)

	useEffect(() => {
		setCurrImageOptions(cover.image.imageOptions)
	}, [cover.image.imageOptions])

	const selectImage = async (url: string) => {
		// Update the book on the client
		updateCover({
			...cover,
			image: {
				...cover.image,
				image: url,
			},
		})
	}

	// const deleteImage = async (url: string, type: string) => {
	// 	if (url === cover.image.image) {
	// 		return
	// 	}
	// 	const originalImageOptions = [...currImageOptions]
	// 	// Immediately update the state
	// 	const newImageOptions = currImageOptions.filter(
	// 		(image) => image.url !== url
	// 	)
	// 	setCurrImageOptions(newImageOptions)

	// 	// Update the book on the server
	// 	const res = await fetch(
	// 		`/api/image/upload?page=${page.key}&bookId=${bookId}&url=${url}&type=${type}`,
	// 		{
	// 			method: 'DELETE',
	// 		}
	// 	)

	// 	if (res.status !== 200) {
	// 		const { error, code } = await res.json()
	// 		setError(error)
	// 		setCurrImageOptions(originalImageOptions)
	// 		return
	// 	}

	// 	// Update the book on the client
	// 	updatePage(
	// 		{
	// 			...page,
	// 			image: {
	// 				...page.image,
	// 				imageOptions: newImageOptions,
	// 			},
	// 		},
	// 		{ clientOnly: true }
	// 	)
	// }

	// const uploadImage = async (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault()
	// 	setLoading(true)

	// 	if (!inputFileRef.current?.files) {
	// 		setLoading(false)
	// 		throw new Error('No file selected')
	// 	}

	// 	const file = inputFileRef.current.files[0]

	// 	const response = await fetch(
	// 		`/api/image/upload?page=${page.key}&bookId=${bookId}`,
	// 		{
	// 			method: 'POST',
	// 			body: file,
	// 		}
	// 	)

	// 	if (response.status !== 200) {
	// 		const { error, code } = await response.json()
	// 		setError(error)
	// 		setLoading(false)
	// 		return
	// 	}

	// 	const newBlob = (await response.json()) as PutBlobResult

	// 	setCurrImageOptions(
	// 		currImageOptions.concat({
	// 			url: newBlob.url,
	// 			error: '',
	// 			type: 'manual',
	// 		})
	// 	)
	// 	// remove file
	// 	inputFileRef.current.value = ''

	// 	// Update book on client
	// 	updatePage(
	// 		{
	// 			...page,
	// 			image: {
	// 				...page.image,
	// 				imageOptions: currImageOptions.concat({
	// 					url: newBlob.url,
	// 					error: '',
	// 					type: 'manual',
	// 				}),
	// 			},
	// 		},
	// 		{ clientOnly: true }
	// 	)

	// 	setLoading(false)
	// }

	const id = backcover ? 'backcover' : 'frontcover'
	return (
		<>
			<div
				// @ts-ignore
				onClick={() => {
					// @ts-ignore
					document.getElementById(id).showModal()
					setNewImages(false)
				}}
				className="hover:transform hover:scale-105 transition-all duration-250 cursor-pointer w-full h-full"
			>
				<ImageDisplay
					newImages={newImages}
					backcover={backcover}
					image={cover.image.image}
				/>
			</div>
			<dialog id={id} className="modal w-5/6 m-auto">
				<div className="modal-box w-full max-w-full h-full">
					<div className="flex flex-row items-start">
						<article className="prose">
							<h3>Select Image for {id}</h3>
						</article>
						{/* <span className="loading loading-spinner loading-lg"></span> */}
						{/* <form onSubmit={uploadImage}>
							<div className="flex flex-row mr-auto ml-8">
								<input
									id="file"
									name="file"
									ref={inputFileRef}
									type="file"
									required
									className="max-w-56"
									accept="image/png, image/jpeg, image/webp"
								/>
								<button
									type="submit"
									className="btn btn-ghost btn-sm mt-0"
								>
									Upload
									<UploadIcon size={6} />
								</button>
							</div>
						</form> */}

						<div className="modal-action mt-0 ml-auto">
							<form method="dialog">
								<button className="btn">Close</button>
							</form>
						</div>
					</div>
					<p
						className={`${
							error === '' ? 'invisible' : ''
						} text-red-400 italic`}
					>
						{error}
					</p>
					<div className="grid grid-cols-3 pb-[700px] gap-y-14 pt-4 gap-x-8">
						{currImageOptions
							.filter(
								(image) =>
									image.url !== '' && image.url !== null
							)
							.map((image, index) => (
								<ImageCard
									selected={
										cover.image.image === image.url &&
										image.url !== ''
									}
									backcover={backcover}
									image={image}
									deleteImage={() => null}
									selectImage={selectImage}
								/>
							))}
						{loading ? (
							<ImageCard
								selected={false}
								backcover={backcover}
								placeholder
								deleteImage={() => {}}
								selectImage={selectImage}
							/>
						) : null}
					</div>
				</div>
			</dialog>
		</>
	)
}

export default CoverImagePicker
