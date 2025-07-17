import AutoUpgrade from "#modules/auto-upgrade/models/AutoUpgrade";
import mailservice from "#modules/shared/services/mail_service";
import TicketService from "#modules/tickets/services/TicketService";
import TierService from "#modules/tickets/services/TierService";
import SeatService from "#modules/tickets/services/SeatService";

export default class AutoUpgradeService {
    static async subscribe(ticketId: number, targetTierId: number) {
        await AutoUpgrade.create({
            ticketId: ticketId,
            targetTierId: targetTierId
        })
    }

    static async notify(tierId: number, seatId: number) {
        const newTier = await TierService.getTier(tierId)
        const newSeat = await SeatService.getSeatBy({id: seatId})
        const autoUpgrades = await AutoUpgrade
            .query()
            .where({ tierId: tierId })
            .preload("ticket",
                (ticketQuery) => {
                    ticketQuery.preload('user').preload('event').preload('seat', async (seatQuery) => seatQuery.preload("tier"))
                })
        await Promise.all(autoUpgrades.map(async (autoUpgrade) => {
            await mailservice.send(autoUpgrade.ticket.user.email,
                "An upgrade for your ticket is available",
                ["The ticket with the follwoing info:",
                    `Event: ${autoUpgrade.ticket.event.title}`,
                    `Tier: ${autoUpgrade.ticket.seat.tier.name}`,
                    `SeatNo: ${autoUpgrade.ticket.seat.id}`,
                    'Can be upgraded to:',
                    `Tier: ${newTier!.name}`,
                    `SeatNo: ${newSeat.id}`,
                    "Please follow the following URL to upgrade your ticket",
                    "URL"
                ]
            )
        }))

    }

    static async upgrade(ticketId: number, seatId: number) {
        await TicketService.updateTicket(ticketId,
            { seatId: seatId }
        )
    }
}