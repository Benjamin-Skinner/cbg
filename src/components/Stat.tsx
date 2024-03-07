interface Props {
	title: string
	value: string
	desc: string
}

const Stat: React.FC<Props> = ({ title, value, desc }) => {
	return (
		<div className="stats shadow w-52 mt-4">
			<div className="stat">
				<div className="stat-title">{title}</div>
				<div className="stat-value">{value}</div>
				<div className="stat-desc">{desc}</div>
			</div>
		</div>
	)
}

export default Stat
