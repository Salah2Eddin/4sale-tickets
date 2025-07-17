
import type { HttpContext } from '@adonisjs/core/http'
import AutoUpgradeService from '#modules/auto-upgrade/services/AutoUpgradeService'
import { subscribeValidator, upgradeValidator } from '#modules/auto-upgrade/validators/AutoUpgradeValidators'


export default class AutoUpgradeController {
    public async subscribe({ request, response }: HttpContext) {
        const { ticketId, targetTierId } = await request.validateUsing(subscribeValidator)
        const isSubscribed = await AutoUpgradeService.checkAlreadySubscibed(ticketId)
        if (isSubscribed) {
            return response.badRequest({
                message: "This ticket is already registered for auto upgrade"
            })
        }
        await AutoUpgradeService.subscribe(ticketId, targetTierId)
        return response.ok({ message: "Subscribed" })
    }

    public async upgrade({ request, response }: HttpContext) {
        const { ticketId, seatId } = await request.validateUsing(upgradeValidator)
        const isSubscribed = await AutoUpgradeService.checkAlreadySubscibed(ticketId)
        if (!isSubscribed) {
            return response.badRequest({
                message: "This ticket is not registered for auto upgrade"
            })
        }
        await AutoUpgradeService.upgrade(ticketId, seatId)
        return response.ok({ message: "Ticket upgraded" })
    }
}