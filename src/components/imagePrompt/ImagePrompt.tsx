import React from 'react'
import { Book, ImagePrompt as ImagePromptT } from '@/types'
import TextBox from './TextBox'
import GeneratePrompt from './GeneratePrompt'

type IdOption =
	| 'frontCover-paper'
	| 'frontCover-hard'
	| 'backCover'
	| 'insideCover'
	| 'page'
	| 'recallAndReflect'

interface Props {
	updatePrompt: (prompt: ImagePromptT) => void
	prompt: ImagePromptT
	bookId: string
	id: IdOption
	pageKey?: string
}

const ImagePrompt: React.FC<Props> = ({
	prompt,
	updatePrompt,
	bookId,
	id,
	pageKey,
}) => {
	return (
		<div>
			<GeneratePrompt
				prompt={prompt}
				updatePrompt={updatePrompt}
				bookId={bookId}
				apiUrl={getApiUrlFromId(id)}
				pageKey={pageKey || 'none'}
			/>
			<TextBox
				prompt={prompt}
				updatePrompt={updatePrompt}
				generating={prompt.status.generating.inProgress}
			/>
		</div>
	)
}

export default ImagePrompt

const getApiUrlFromId = (id: IdOption) => {
	switch (id) {
		case 'frontCover-paper':
			return '/api/generate/image-prompt/front-cover-paper'
		case 'frontCover-hard':
			return '/api/generate/image-prompt/front-cover-hard'
		case 'backCover':
			return '/api/generate/image-prompt/back-cover'
		case 'insideCover':
			return '/api/generate/image-prompt/inside-cover'
		case 'page':
			return '/api/generate/image-prompt/page'
		case 'recallAndReflect':
			return '/api/generate/image-prompt/recall-and-reflect'
	}
}
