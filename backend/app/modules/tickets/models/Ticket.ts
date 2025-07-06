import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '@modules/users/models/User.js'
import Event from '@modules/events/models/Event.js'
import Seat from '@modules/tickets/models/Seat.js'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare eventId: number

  @column()
  declare seatId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>

  @belongsTo(() => Seat)
  declare seat: BelongsTo<typeof Seat>
}
