
import mongoose from 'mongoose'
import env from '#start/env'

const MONGODB_URI = env.get('MONGO_URI')!

if (!MONGODB_URI) {
    console.error('MONGO_URI is not defined in the environment variables')
}
export async function connectMongoDB() {
    try {
    await mongoose.connect(MONGODB_URI)

    console.log('Connected to MongoDB')
    } catch (error) {
    console.error(' MongoDB connection error:', error)
    process.exit(1)
    }
}
