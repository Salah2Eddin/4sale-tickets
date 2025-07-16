import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Event from '#modules/events/models/Event'
import Tier from '#modules/tickets/models/Tier'
import Ticket from '#modules/tickets/models/Ticket'

export default class Resell extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'event_id' })
  declare eventId: number

  @column({ columnName: 'tier_id' })
  declare tierId: number

  @column({ columnName: 'ticket_id' })
  declare ticketId: number

  @column()
  declare price: number

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => Tier)
  declare tier: BelongsTo<typeof Tier>

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>
}
