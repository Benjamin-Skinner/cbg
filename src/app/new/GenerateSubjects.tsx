import { Dispatch, SetStateAction, useState } from 'react'
import { SubjectOptions, Subject } from '@/types'
import Options from './Options'
import { useRouter } from 'next/navigation'
import RegenerateButton from './RegenerateButton'

interface Props {
	setSubjects: (addedSubjects: Subject[]) => void
	setError: Dispatch<SetStateAction<string>>
}

const GenerateSubjects: React.FC<Props> = ({ setSubjects, setError }) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const [options, setOptions] = useState<SubjectOptions>({
		grade: 'All',
		subject: 'Other',
	})

	const regenerateSubjects = async () => {
		setLoading(true)
		const res = await fetch('/api/generate/subjects', {
			method: 'POST',
			body: JSON.stringify({
				options,
				prompt: '',
			}),
		})

		if (res.status !== 200) {
			const { error, code } = await res.json()
			console.error(error)
			setError(error)
			setLoading(false)
			return
		} else {
			const data = await res.json()
			console.log(data)
			setSubjects(data.data)
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col h-full">
			<Options options={options} setOptions={setOptions} />
			<RegenerateButton
				loading={loading}
				regenerateSubjects={regenerateSubjects}
			/>
		</div>
	)
}

export default GenerateSubjects
