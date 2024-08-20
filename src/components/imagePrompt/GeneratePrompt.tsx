import React from 'react'
import { RefreshIcon } from '@/components/Icons'
import useGenerateImagePrompt from './useGenerateImagePrompt'
import { ImagePrompt } from '@/types'

interface Props {
	prompt: ImagePrompt
	updatePrompt: (prompt: ImagePrompt) => void
	bookId: string
	apiUrl: string
	pageKey: string
}

const GeneratePrompt: React.FC<Props> = ({
	prompt,
	bookId,
	updatePrompt,
	apiUrl,
	pageKey,
}) => {
	const { generateImagePrompt } = useGenerateImagePrompt(
		updatePrompt,
		prompt,
		apiUrl,
		bookId,
		pageKey
	)

	return (
		<div className="">
			<div className="flex flex-row items-center space-x-3">
				<article className="prose">
					<h4>Image Prompt</h4>
				</article>

				<button
					className="btn btn-ghost btn-sm"
					onClick={generateImagePrompt}
				>
					{prompt.status.generating.inProgress ? (
						<>
							<span className="loading loading-dots loading-md"></span>
							Retry
						</>
					) : (
						<RefreshIcon />
					)}
				</button>
			</div>
			<div>
				<p className="italic text-sm text-red-500">
					{prompt.status.message.content}
				</p>
			</div>
		</div>
	)
}

export default GeneratePrompt
