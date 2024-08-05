import { ImagePrompt } from '@/types'

interface Props {
	updatePrompt: (prompt: ImagePrompt) => void
	prompt: ImagePrompt
	generating: boolean
}

const TextBox: React.FC<Props> = ({ prompt, updatePrompt, generating }) => {
	const updatePromptText = (newPrompt: string) => {
		updatePrompt({
			...prompt,
			content: newPrompt,
		})
	}

	return (
		<textarea
			value={prompt.content}
			disabled={generating}
			onChange={(e) => updatePromptText(e.target.value)}
			className="textarea h-48 w-full mt-4 leading-5"
		/>
	)
}

export default TextBox
