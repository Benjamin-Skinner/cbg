import { PageImage } from '@/types'
import Status from '@/components/Status'
import CancelGeneration from './CancelGeneration'
import { useGenerateImages } from './useGenerateImages'
import { useUpdateImages } from './useUpdateImages'
import { IMAGE_POLL_TIME } from '@/constants'
import { useInterval } from 'usehooks-ts'

type IdOption =
	| 'frontCover-hard'
	| 'backCover'
	| 'insideCover'
	| 'frontCover-paper'

interface Props {
	setNewImages: (newImages: boolean) => void
	image: PageImage
	updateImage: (image: PageImage) => void
	bookId: string
	id: IdOption
}

const GenerateImages: React.FC<Props> = ({
	image,
	updateImage,
	bookId,
	setNewImages,
	id,
}) => {
	const apiUrl = apiUrlFromId(id)

	const { generateImages } = useGenerateImages(
		image,
		updateImage,
		apiUrl,
		bookId
	)

	const { updateImages } = useUpdateImages(
		image,
		updateImage,
		`${apiUrl}/update`,
		bookId,
		setNewImages
	)

	useInterval(
		() => {
			// Your custom logic here
			if (image.status.generating.inProgress) {
				console.log(`Polling for images for page ${id}`)
				updateImages()
			}
		},
		// Delay in milliseconds or null to stop it
		IMAGE_POLL_TIME * 1000
	)

	return (
		<button
			disabled={image.status.generating.inProgress}
			onClick={generateImages}
			className="btn btn-info btn-wide mt-12"
		>
			Generate Images
		</button>
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
	}
}
