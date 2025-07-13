import { Schema, model, Document } from 'mongoose'

export interface SeatCacheDocument extends Document {
    eventId: number
    seatId: number
    status: 'available' | 'locked' | 'booked'
    lockedBy: number | null
    lockedAt: Date | null
}

const SeatCacheSchema = new Schema<SeatCacheDocument>({
    eventId: { type: Number, required: true },
    seatId: { type: Number, required: true },
    status: { type: String, enum: ['available', 'locked', 'booked'], default: 'available' },
    lockedBy: { type: Number, default: null },
    lockedAt: { type: Date, default: null },
}, {
    timestamps: true
})

const SeatCacheModel = model<SeatCacheDocument>('SeatCache', SeatCacheSchema)

export default SeatCacheModel
