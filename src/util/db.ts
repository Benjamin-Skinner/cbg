// Copied from MongoDB's documentation example

import { MongoClient } from 'mongodb'

if (!process.env.MONGO_USERNAME) {
	throw new Error('MONGO_USERNAME is not set in the environment variables')
}

if (!process.env.MONGO_PASSWORD) {
	throw new Error('MONGO_PASSWORD is not set in the environment variables')
}

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.c15sj.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`

// Set your desired timeout values in milliseconds
const options = {
	socketTimeoutMS: 30000, // 30 seconds
	connectTimeoutMS: 30000, // 30 seconds
}

declare global {
	var _mongoClientPromise: Promise<MongoClient>
}

class Singleton {
	private static _instance: Singleton
	private client: MongoClient
	private clientPromise: Promise<MongoClient>
	private constructor() {
		this.client = new MongoClient(uri, options)
		this.clientPromise = this.client.connect()
		if (process.env.NODE_ENV === 'development') {
			// In development mode, use a global variable so that the value
			// is preserved across module reloads caused by HMR (Hot Module Replacement).
			global._mongoClientPromise = this.clientPromise
		}
	}

	public static get instance() {
		if (!this._instance) {
			this._instance = new Singleton()
		}
		return this._instance.clientPromise
	}
}
const clientPromise = Singleton.instance

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
