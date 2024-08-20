import { SECTION_GUIDELINES, PROMPT_TIPS } from '@/constants'

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
		<div className="flex flex-row mt-36 w-full">
			<div className="w-96 pl-2">
				<article className="prose mt-3">
					<h2 className="text-base md:text-xl">{title}</h2>
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
	return <div className="w-full ">{children}</div>
}

interface RightProps {
	children?: React.ReactNode
	sectionName?: string
}
const Right: React.FC<RightProps> = ({ children, sectionName }) => {
	return (
		<div className="w-96 lg:pl-8">
			{children}
			{sectionName && (
				<div>
					<div className="stats shadow w-full mt-12">
						<div className="stat">
							<div className="stat-title">Section Checklist</div>
							<ul className="list-disc list-inside">
								{/* @ts-ignore */}
								{SECTION_GUIDELINES[sectionName].map(
									(item: string, index: number) => (
										<li className="stat-desc  w-full text-wrap">
											{item}
										</li>
									)
								)}
							</ul>
						</div>
					</div>
					{/* @ts-ignore */}
					{PROMPT_TIPS[sectionName].length > 0 && (
						<div className="stats shadow w-full mt-3">
							<div className="stat">
								<div className="stat-title">Prompt Tips</div>
								<ul className="list-disc list-inside">
									{/* @ts-ignore */}
									{PROMPT_TIPS[sectionName].map(
										(item: string, index: number) => (
											<li className="stat-desc  w-full text-wrap">
												{item}
											</li>
										)
									)}
								</ul>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

Section.Center = Center
Section.Right = Right

export default Section
