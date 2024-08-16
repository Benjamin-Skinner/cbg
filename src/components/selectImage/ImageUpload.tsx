/**
 * Has the form for uploading an image.
 *
 * It should send the image to the server, retrieve the response, and then update the book locally with the new image
 */

import React, { useRef } from 'react'
import { UploadIcon } from '../Icons'
import { ImageAR, ImageOption, PageImage } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	uploadUrl: string
	setLoading: (loading: boolean) => void
	setError: (error: string) => void
	addImageOption: (option: ImageOption) => void
	imageUploading: boolean
	// updateImage: (image: PageImage, options?: UpdateBookOptions) => void
}

const ImageUpload: React.FC<Props> = ({
	setLoading,
	uploadUrl,
	setError,
	addImageOption,
	imageUploading,
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null)

	const uploadImage = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// STEP 1: Update the loading state
		setLoading(true)

		// STEP 2: Check if there is a file selected
		if (!inputFileRef.current?.files) {
			setLoading(false)
			throw new Error('No file selected')
		}

		const file = inputFileRef.current.files[0]

		// STEP 3: Send the image to the server
		const response = await fetch(uploadUrl, {
			method: 'POST',
			body: file,
		})

		// STEP 4: Handle the response
		// - If there is an error, set the error and setLoading false
		if (response.status !== 200) {
			const { error, code } = await response.json()
			setError(error)
			setLoading(false)
			return
		}

		// If there is a successful response, we know there is a new image option already saved to the DB
		// We just need to update locally (both imageOptions and Page)
		const newImageOption = await response.json()

		// Update image option on client
		addImageOption(newImageOption)

		// remove file
		inputFileRef.current.value = ''

		setLoading(false)
		setError('')
	}

	return (
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
					disabled={imageUploading}
				/>
				<button type="submit" className="btn btn-ghost btn-sm mt-0">
					Upload
					<UploadIcon size={6} />
				</button>
			</div>
		</form>
	)
}

export default ImageUpload
