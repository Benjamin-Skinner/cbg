import { FaSquareFull } from 'react-icons/fa6'
import { BiSolidRectangle } from 'react-icons/bi'

interface Props {
	size?: number
	color?: string
}

const DEFAULT_ICON_SIZE = 4

export const Lock: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-4 h-4"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
	)
}

export const RefreshIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
	)
}

export const LockOpenIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
	)
}

export const UploadIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
			/>
		</svg>
	)
}

export const OpenInNewWindowIcon: React.FC<Props> = ({
	size = DEFAULT_ICON_SIZE,
	color = 'currentColor',
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke={color}
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
			/>
		</svg>
	)
}

export const SavedIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	)
}

export const XIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6 18 18 6M6 6l12 12"
			/>
		</svg>
	)
}

export const SaveIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className={`w-${size} h-${size}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
			/>
		</svg>
	)
}

export const SquareIcon = ({ size = DEFAULT_ICON_SIZE }) => {
	return <FaSquareFull className={`w-${size} h-${size}`} />
}

export const RectangleIcon: React.FC<Props> = ({
	size = DEFAULT_ICON_SIZE,
}) => {
	return <BiSolidRectangle className={`w-${size} h-${size} scale-x-150`} />
}

export const HardcoverIcon: React.FC<Props> = ({
	size = DEFAULT_ICON_SIZE,
}) => {
	return <BiSolidRectangle className={`w-${size} h-${size} scale-y-150`} />
}

export const RandRIcon: React.FC<Props> = ({ size = DEFAULT_ICON_SIZE }) => {
	return <BiSolidRectangle className={`w-${size} h-${size * 4}`} />
}
