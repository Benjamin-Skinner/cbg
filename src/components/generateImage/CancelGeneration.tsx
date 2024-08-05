import React from 'react'
import { PageImage } from '@/types'

interface Props {
	image: PageImage
	updateImage: (image: PageImage) => void
}

const CancelGeneration: React.FC<Props> = ({ image, updateImage }) => {
	const cancelGeneration = () => {
		updateImage({
			...image,
			status: {
				...image.status,
				generating: {
					inProgress: false,
					progress: 0,
				},
			},
		})
	}
	if (image.status.generating.inProgress) {
		return (
			<button
				className="btn btn-sm btn-outline ml-6"
				onClick={cancelGeneration}
			>
				Cancel
			</button>
		)
	} else {
		return null
	}
}

export default CancelGeneration
