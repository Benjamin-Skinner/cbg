import { SECTION_GUIDELINES } from '@/constants'

interface SectionComponent {
	Center: React.FC<CenterProps>
	Right: React.FC<RightProps>
}

interface SectionProps {
	children?: React.ReactNode
	title: string
}

const Section: React.FunctionComponent<SectionProps> & SectionComponent = ({
	children,
	title,
}) => {
	return (
		<div className="flex flex-row w-full mt-36">
			<div className="w-2/12 flex justify-center">
				<article className="prose mt-3">
					<h2>{title}</h2>
				</article>
			</div>
			{children}
		</div>
	)
}
interface CenterProps {
	children?: React.ReactNode
}

const Center: React.FC<CenterProps> = ({ children }) => {
	return <div className="w-7/12">{children}</div>
}

interface RightProps {
	children?: React.ReactNode
	sectionName?: string
}
const Right: React.FC<RightProps> = ({ children, sectionName }) => {
	return (
		<div className="w-3/12 flex flex-col">
			{children}
			{sectionName && (
				<div className="stats shadow w-full mt-12">
					<div className="stat">
						<div className="stat-title">Section Checklist</div>
						<ul className="list-disc list-inside text-wrap pr-4">
							{/* @ts-ignore */}
							{SECTION_GUIDELINES[sectionName].map(
								(item: string, index: number) => (
									<li className="stat-desc">{item}</li>
								)
							)}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

Section.Center = Center
Section.Right = Right

export default Section
