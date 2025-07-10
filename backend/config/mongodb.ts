
import mongoose from 'mongoose'
import env from '#start/env'

const MONGODB_URI = env.get('MONGO_URI')!


export async function connectMongoDB() {
    try {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as any)

    console.log('Connected to MongoDB')
    } catch (error) {
    console.error(' MongoDB connection error:', error)
    process.exit(1)
    }
}
