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
/**
 * Get everything between the last / and the .png
 */
export function getImageUrlId(url: string) {
	const name = extractPngName(url)

	// Find the last occurrence of '/'
	const lastSlashIndex = name.lastIndexOf('/')

	// Extract the substring between the last '/' and '.png'
	// Assuming the string ends with '.png', we remove the last 4 characters
	const substring = name.substring(lastSlashIndex + 1, name.length - 4)

	return substring
}
