import { PageImage } from '@/types'
import { useGenerateImages } from './useGenerateImages'
import { useUpdateImages } from './useUpdateImages'
import { IMAGE_POLL_TIME } from '@/constants'
import { useInterval } from 'usehooks-ts'
import { useState } from 'react'

type IdOption =
	| 'frontCover-hard'
	| 'backCover'
	| 'insideCover'
	| 'frontCover-paper'
	| 'page'
	| 'recallAndReflect'

interface Props {
	setNewImages: (newImages: boolean) => void
	image: PageImage
	updateImage: (image: PageImage) => void
	bookId: string
	id: IdOption
	pageKey?: string
	disabled?: boolean // Extra condition to disable the button
}

const GenerateImages: React.FC<Props> = ({
	image,
	updateImage,
	bookId,
	setNewImages,
	id,
	pageKey,
	disabled,
}) => {
	const [responseReceived, setResponseReceived] = useState(false)
	const apiUrl = apiUrlFromId(id)

	const { generateImages } = useGenerateImages(
		image,
		updateImage,
		apiUrl,
		bookId,
		pageKey || 'none',
		setResponseReceived
	)

	const { updateImages } = useUpdateImages(
		image,
		updateImage,
		`${apiUrl}`,
		bookId,
		setNewImages,
		pageKey || 'none',
		setResponseReceived
	)

	/**
	 * If the status is in progress, fetch
	 * If not, then try 2 more times just to make sure there wasn't some race condition
	 */
	useInterval(
		() => {
			// Your custom logic here
			if (
				image.status.generating.inProgress && // image is generating
				image.status.generating.progress < 100 && // not done
				responseReceived // The job has actually been sent
			) {
				console.log('Polling images')
				updateImages()
			}
		},
		// Delay in milliseconds or null to stop it
		IMAGE_POLL_TIME * 1000
	)

	return (
		<>
			<button
				disabled={image.status.generating.inProgress || disabled}
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
		</>
	)
}

export default GenerateImages

const apiUrlFromId = (id: IdOption) => {
	switch (id) {
		case 'frontCover-hard':
			return '/api/generate/image/front-cover-hard'
		case 'backCover':
			return '/api/generate/image/back-cover'
		case 'insideCover':
			return '/api/generate/image/inside-cover'
		case 'frontCover-paper':
			return '/api/generate/image/front-cover-paper'
		case 'page':
			return '/api/generate/image/page'
		case 'recallAndReflect':
			return '/api/generate/image/recall-and-reflect'
	}
}
