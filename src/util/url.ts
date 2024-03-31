/**
 * Extract everything in the string before and including the .png
 */
export function extractPngName(url: string) {
	const index = url.lastIndexOf('.png')
	if (index !== -1) {
		return url.substring(0, index + 4)
	}
	return url
}
