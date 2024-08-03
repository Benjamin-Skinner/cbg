import { ImageAR } from '@/types'
export function arToBoolean(ar: ImageAR): {
	fullPage: boolean
	square: boolean
	hardcover: boolean
	rAndR: boolean
} {
	const fullPage = ar.height === 5 && ar.width === 2
	const square = ar.height === 1 && ar.width === 1
	const hardcover = ar.height === 22 && ar.width === 17
	const rAndR = ar.height === 1 && ar.width === 4

	return { fullPage, square, hardcover, rAndR }
}
