interface Props {
	title: string
	value: string
	desc: string
	error?: boolean
}

const Stat: React.FC<Props> = ({ title, value, desc, error = false }) => {
	return (
		<div className="stats shadow w-52 mt-4">
			<div className="stat">
				<div className="stat-title">{title}</div>
				<div className={`stat-value ${error && 'text-red-500'}`}>
					{value}
				</div>
				<div className="stat-desc">{desc}</div>
			</div>
		</div>
	)
}

export default Stat
