import { HttpContext } from '@adonisjs/core/http'
import TierService from '#modules/tickets/services/TierService'
import { createTierValidator, updateTierValidator } from '../validators/TierValidator.js'

export default class TierController {
  async index({ params }: HttpContext) {
    const eventId = params.id
    return await TierService.getEventTiers(eventId)
  }

  async show({ params }: HttpContext) {
    const tierId = params.id
    return await TierService.getTier(tierId)
  }

  async store({ request, response }: HttpContext) {
    const {name, price, capacity, eventId} = await request.validateUsing(createTierValidator)
    await TierService.createTier(name, price, capacity, eventId)
    return response.created({ message: 'Tier created' })
  }

  async update({ request, response }: HttpContext) {
    const tierId = request.param('id')
    const payload = await request.validateUsing(updateTierValidator)
    await TierService.updateTier(tierId, payload)
    return response.ok({ message: 'Tier updated' })
  }

  async destroy({ params, response }: HttpContext) {
    const tierId = params.id
    await TierService.deleteTier(Number(tierId))
    return response.ok({ message: 'Tier deleted' })
  }
}
