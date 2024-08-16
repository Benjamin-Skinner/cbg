import s3 from './config'

/**
 * Deletes an image from S3 with a given URL
 */
export async function deleteImageFromAWS(imageUrl: string): Promise<void> {
	try {
		// Extract the bucket name and key from the URL
		const { bucketName, key } = extractBucketAndKeyFromUrl(imageUrl)

		// Set up the parameters for the S3 deleteObject call
		const params = {
			Bucket: bucketName,
			Key: key,
		}

		// Call the deleteObject method to delete the file
		await s3.deleteObject(params).promise()
	} catch (error) {
		throw new Error('Failed to delete image from AWS S3')
	}
}

// Helper function to extract the bucket name and key from the URL
function extractBucketAndKeyFromUrl(url: string): {
	bucketName: string
	key: string
} {
	// Example URL: https://cbgstorage.s3.amazonaws.com/your-file-path.png

	const urlObj = new URL(url)

	// Extract bucket name from the hostname
	const bucketName = urlObj.hostname.split('.')[0] // cbgstorage

	// Extract the key from the pathname
	const key = urlObj.pathname.substring(1) // your-file-path.png

	return { bucketName, key }
}
