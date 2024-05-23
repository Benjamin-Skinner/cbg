interface Props {
	loading: boolean
	regenerateSubjects: () => void
}

const RegenerateButton: React.FC<Props> = ({ loading, regenerateSubjects }) => {
	return (
		<div className="w-full self-end mt-auto mb-4">
			<div className="space-y-2  w-52 m-auto">
				<button
					className="btn btn-info m-auto w-full"
					disabled={loading}
					onClick={regenerateSubjects}
				>
					Generate Subjects
				</button>
				<div className="flex items-center justify-center w-full">
					{loading ? (
						<div className="flex flex-row">
							<div className="badge badge-info badge-xl">
								Generating
							</div>
							<span className="loading loading-bars loading-md text-info ml-4"></span>
						</div>
					) : (
						<div className="flex flex-col">
							<div className="badge badge-neutral badge-xl">
								Waiting
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default RegenerateButton
