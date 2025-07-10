
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/seat_cache'

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
