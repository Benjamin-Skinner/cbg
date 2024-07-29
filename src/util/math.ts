export function isApproximatelyEqual(a: number, b: number, epsilon = 0.001) {
	return Math.abs(a - b) < epsilon
}
