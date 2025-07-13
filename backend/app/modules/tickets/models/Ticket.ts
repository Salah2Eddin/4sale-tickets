import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#modules/users/models/User'
import Event from '#modules/events/models/Event'
import Seat from '#modules/tickets/models/Seat'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare eventId: number

  @column()
  declare seatId: number

  @column()
  declare status: string

  @column()
  declare checkedIn: boolean

  @column()
  declare price: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => Seat)
  declare seat: BelongsTo<typeof Seat>
}
