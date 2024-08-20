'use client'

import { XIcon } from '@/components/Icons'

interface Props {
	warningMessage: string
	setWarningMessage: (message: string) => void
}

const ShowWarning: React.FC<Props> = ({
	warningMessage,
	setWarningMessage,
}) => {
	if (!warningMessage) return null
	return (
		<div className="transition-all duration-500 fixed opacity-70 z-50 w-full top-5">
			<div role="alert" className="alert alert-warning w-11/12 m-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span>Warning: {warningMessage}</span>
				<button onClick={() => setWarningMessage('')}>
					<XIcon size={6} />
				</button>
			</div>
		</div>
	)
}

export default ShowWarning
