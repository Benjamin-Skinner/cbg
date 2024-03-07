'use client'

import { UploadIcon } from './Icons'
import ImageCard from './ImageCard'
import ImageDisplay from './ImageDisplay'

interface Props {
	id: string
	title: string
	backcover?: boolean
	image: string
}

const ImagePicker: React.FC<Props> = ({
	id,
	title,
	backcover = false,
	image,
}) => {
	return (
		<>
			<div
				// @ts-ignore
				onClick={() => document.getElementById(id).showModal()}
				className="hover:transform hover:scale-105 transition-all duration-250 cursor-pointer"
			>
				<ImageDisplay backcover={backcover} image={image} />
			</div>
			<dialog id={id} className="modal w-5/6 m-auto">
				<div className="modal-box w-full max-w-full h-full">
					<div className="flex flex-row justify-between items-start ">
						<article className="prose">
							<h3>Select Image for {title}</h3>
						</article>
						<button className="btn btn-ghost btn-sm m-auto mt-0">
							Upload a file
							<UploadIcon size={6} />
						</button>
						<div className="modal-action mt-0">
							<form method="dialog">
								<button className="btn">Cancel</button>
							</form>
						</div>
					</div>
					<div className="grid grid-cols-3 pb-[700px] gap-y-14 pt-8 gap-x-8">
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
						<ImageCard backcover={backcover} />
					</div>
				</div>
			</dialog>
		</>
	)
}

export default ImagePicker
