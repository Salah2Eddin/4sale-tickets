import Tier from "#modules/tickets/models/Tier"
import Seat from "#modules/tickets/models/Seat"

export default class SeatService {
    static async createEventSeats(eventId: number) {
        const tiers = await Tier.query().where('event_id', eventId)
        for (const tier of tiers) {
            const seatData = []
            for (let i = 0; i < tier.capacity; i++) {
                seatData.push({
                    tierId: tier.id,
                    eventId: eventId,
                })
            }
            await Seat.createMany(seatData)
        }
    }
    static async createTierSeats(tierId: number) {
        const tier = await Tier.findOrFail(tierId)
        const seatData = []
        for (let i = 0; i < tier.capacity; i++) {
            seatData.push({
                tierId: tier.id,
                eventId: tier.eventId,
            })
        }
        await Seat.createMany(seatData)
    }

    static async getSeatBy(filters: Record<string, any>){
        return await Seat.findByOrFail(filters)
    }
    static async updateSeat(filters: Record<string, any>, data: Partial<Seat>, options?:{client?:any}){
        return await Seat.query(options).where(filters).update(data)
    }
}