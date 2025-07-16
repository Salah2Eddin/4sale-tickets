import Tier from "#modules/tickets/models/Tier";
import SeatService from "#modules/tickets/services/SeatService";

export default class TierService {
  static async createTier(name: string, price: number, capacity: number, eventId: number) {
    const tier = await Tier.create({
      name: name,
      price: price,
      capacity: capacity,
      eventId: eventId,
    })
    await SeatService.createTierSeats(tier.id)
  }

  static async updateTier(
    tierId: number,
    data: { name?: string; price?: number; capacity?: number; eventId?: number }
  ) {
    await Tier.query().where('id', tierId).update(data)
  }

  static async deleteTier(tierId: number) {
    await Tier.query().where('id', tierId).delete()
  }

  static async getTier(tierId: number) {
    return await Tier.find(tierId)
  }

  static async getEventTiers(eventId: number) {
    return await Tier.findBy({ eventId: eventId })
  }
}