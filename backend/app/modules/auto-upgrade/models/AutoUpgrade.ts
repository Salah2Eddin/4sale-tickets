import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Ticket from '#modules/tickets/models/Ticket'
import Tier from '#modules/tickets/models/Tier'

export default class AutoUpgrade extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ticketId: number

  @column()
  declare targetTierId: number

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>

  @belongsTo(() => Tier)
  declare targetTier: BelongsTo<typeof Tier>
}
