import React from 'react'
import Status from '@/components/Status'
import { PageImage } from '@/types'
import CancelGeneration from '@/components/generateImage/CancelGeneration'

interface Props {
	image: PageImage
	updateImage: (image: PageImage) => void
}

const ImageGenerationStatus: React.FC<Props> = ({ image, updateImage }) => {
	return (
		<div className="flex flex-row mb-6">
			<Status section="backcover" status={image.status} image />
			<CancelGeneration image={image} updateImage={updateImage} />
		</div>
	)
}

export default ImageGenerationStatus
