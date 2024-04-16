'use client'

import React, { useEffect, useRef, useState } from 'react'
import { UploadIcon, XIcon } from './Icons'
import ImageCard from './ImageCard'
import ImageDisplay from './ImageDisplay'
import type { PutBlobResult } from '@vercel/blob'
import { Page } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	page: Page
	bookId: string
	backcover?: boolean
	updatePage: (page: Page, options?: UpdateBookOptions) => void
	newImages: boolean
	setNewImages: (newImages: boolean) => void
}

const ImagePicker: React.FC<Props> = ({
	page,
	bookId,
	updatePage,
	backcover = false,
	newImages,
	setNewImages,
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [currImageOptions, setCurrImageOptions] = useState(
		page.image.imageOptions
	)

	useEffect(() => {
		setCurrImageOptions(page.image.imageOptions)
	}, [page.image.imageOptions])

	const selectImage = async (url: string) => {
		// Update the book on the client
		updatePage({
			...page,
			image: {
				...page.image,
				image: url,
			},
		})
	}

	const deleteImage = async (url: string, type: string) => {
		if (url === page.image.image) {
			return
		}
		const originalImageOptions = [...currImageOptions]
		// Immediately update the state
		const newImageOptions = currImageOptions.filter(
			(image) => image.url !== url
		)
		setCurrImageOptions(newImageOptions)

		// Update the book on the server
		const res = await fetch(
			`/api/image/upload?page=${page.key}&bookId=${bookId}&url=${url}&type=${type}`,
			{
				method: 'DELETE',
			}
		)

		if (res.status !== 200) {
			const { error, code } = await res.json()
			setError(error)
			setCurrImageOptions(originalImageOptions)
			return
		}

		// Update the book on the client
		updatePage(
			{
				...page,
				image: {
					...page.image,
					imageOptions: newImageOptions,
				},
			},
			{ clientOnly: true }
		)
	}

	const uploadImage = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setLoading(true)

		if (!inputFileRef.current?.files) {
			setLoading(false)
			throw new Error('No file selected')
		}

		const file = inputFileRef.current.files[0]

		const response = await fetch(
			`/api/image/upload?page=${page.key}&bookId=${bookId}`,
			{
				method: 'POST',
				body: file,
			}
		)

		if (response.status !== 200) {
			const { error, code } = await response.json()
			setError(error)
			setLoading(false)
			return
		}

		const newBlob = (await response.json()) as PutBlobResult

		setCurrImageOptions(
			currImageOptions.concat({
				url: newBlob.url,
				error: '',
				type: 'manual',
			})
		)
		// remove file
		inputFileRef.current.value = ''

		// Update book on client
		updatePage(
			{
				...page,
				image: {
					...page.image,
					imageOptions: currImageOptions.concat({
						url: newBlob.url,
						error: '',
						type: 'manual',
					}),
				},
			},
			{ clientOnly: true }
		)

		setLoading(false)
	}

	return (
		<>
			<div
				onClick={() => {
					// @ts-ignore
					document.getElementById(page.key).showModal()
					setNewImages(false)
				}}
				className="hover:transform hover:scale-105 transition-all duration-250 cursor-pointer"
			>
				<ImageDisplay
					newImages={newImages}
					backcover={backcover}
					image={page.image.image}
				/>
			</div>
			<dialog id={page.key} className="modal w-5/6 m-auto">
				<div className="modal-box w-full max-w-full h-full">
					<div className="flex flex-row items-start">
						<article className="prose">
							<h3>Select Image for "{page.title}"</h3>
						</article>
						{/* <span className="loading loading-spinner loading-lg"></span> */}
						<form onSubmit={uploadImage}>
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
						</form>

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
										page.image.image === image.url &&
										image.url !== ''
									}
									backcover={backcover}
									image={image}
									deleteImage={() =>
										deleteImage(image.url, image.type)
									}
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

export default ImagePicker

interface ErrorBannerProps {
	message: string
	setError: (message: string) => void
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, setError }) => {
	return (
		<div className="transition-all duration-500 fixed opacity-70 z-50 w-full">
			<div role="alert" className="alert alert-error w-11/12 m-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span>Warning: {message}</span>
				<button onClick={() => setError('')}>
					<XIcon size={6} />
				</button>
			</div>
		</div>
	)
}
