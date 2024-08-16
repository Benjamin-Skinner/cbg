/**
 * The parent of the modal.
 *
 * It's children should handle all image selection functionality.
 */

import { PageImage, ImageOption, ImageAR } from '@/types'
import { useEffect, useState } from 'react'
import ImageOptionList from './ImageOptionList'
import ImageUpload from './ImageUpload'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	image: PageImage
	updateImage: (image: PageImage, options?: UpdateBookOptions) => void
	uploadUrl: string
	deleteUrl: (url: string) => string
	modalTitle: string
	modalId: string
}

const ImageModal: React.FC<Props> = ({
	image,
	updateImage,
	uploadUrl,
	deleteUrl,
	modalTitle,
	modalId,
}) => {
	// If there is an error in the manual image upload process
	const [error, setError] = useState('')

	// Whether there is an image that is being uploaded
	const [imageUploading, setImageUploading] = useState(false)

	// Array to store the current image options; comes from the page, then gets updated by the user's actions
	const [currImageOptions, setCurrImageOptions] = useState<ImageOption[]>(
		image.imageOptions
	)

	// Update the image options when the image changes
	useEffect(() => {
		setCurrImageOptions(image.imageOptions)
	}, [image.imageOptions])

	const addImageOption = (option: ImageOption) => {
		// Add to imageOptions
		setCurrImageOptions([...currImageOptions, option])

		// Add to local Book (client only)
		updateImage(
			{
				...image,
				imageOptions: [...currImageOptions, option],
			},
			{ clientOnly: true }
		)
	}

	const deleteImage = async (option: ImageOption) => {
		console.log('deleteImage')

		// Immediately update state
		const originalImageOptions = [...currImageOptions]
		const updatedImageOptions = currImageOptions.filter(
			(image) => image.url !== option.url
		)
		setCurrImageOptions(updatedImageOptions)

		// Call the API route
		const res = await fetch(deleteUrl(option.url), {
			method: 'POST',
		})

		// If there is an error, set the error
		if (res.status !== 200) {
			console.log('ERROR')
			const { error, code } = await res.json()
			setError(error)
			setCurrImageOptions(originalImageOptions)
			return
		}

		// Don't update anything based on the result
		setError('')
	}

	return (
		<dialog id={modalId} className="modal w-5/6 m-auto">
			<div className="modal-box w-full max-w-full h-full">
				<div className="">
					<div className="flex flex-row items-start">
						<article className="prose">
							<h3>Select image for {modalTitle}</h3>
						</article>

						<div className="modal-action mt-0 ml-auto">
							<form method="dialog">
								<button
									className="btn"
									onClick={() => setError('')}
								>
									Close
								</button>
							</form>
						</div>
					</div>
					<ImageUpload
						uploadUrl={uploadUrl}
						setLoading={setImageUploading}
						setError={setError}
						addImageOption={addImageOption}
						imageUploading={imageUploading}
					/>
					<p
						className={`${
							error === '' ? 'invisible' : ''
						} text-red-400 italic`}
					>
						{error}
					</p>
				</div>

				<ImageOptionList
					image={image}
					updateImage={updateImage}
					currImageOptions={currImageOptions}
					deleteImage={deleteImage}
					imageUploading={imageUploading}
				/>
			</div>
		</dialog>
	)
}

export default ImageModal
