import s3 from '@/util/aws/config'
import { readableStreamToBuffer } from '@/util/image'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { v4 as uuidv4 } from 'uuid'

/**
 * Uploads an image to S3 and returns the URL of the saved image
 */
export async function saveImageToAWS(
	bookId: string,
	stream: ReadableStream
): Promise<{ savedUrl: string }> {
	try {
		// Convert the ReadableStream to a Buffer
		const buffer = await readableStreamToBuffer(stream)

		// Generate a unique filename using the bookId and a UUID
		const filename = `${bookId}/${uuidv4()}.png`

		const bucket = process.env.S3_BUCKET_NAME
		if (!bucket) {
			throw new Error('No S3 bucket name provided')
		}

		// Set up the parameters for the S3 upload
		const params: PutObjectRequest = {
			Bucket: bucket,
			Key: filename,
			Body: buffer,
			ContentType: 'image/png',
		}

		// Upload the image to S3
		const data = await s3.upload(params).promise()

		// Return the saved URL
		return { savedUrl: data.Location }
	} catch (error) {
		throw new Error('Failed to save image to AWS S3')
	}
}
