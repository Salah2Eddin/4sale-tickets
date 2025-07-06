import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import User from '@modules/users/models/User.js'
import Waitlist from '@modules/waitlist/models/Waitlist.js'
import Ticket from '@modules/tickets/models/Ticket.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizerId: number

  @belongsTo(() => User, { foreignKey: 'organizerId' })
  declare organizer: BelongsTo<typeof User>

  @hasOne(() => Waitlist)
  declare waitlist: HasOne<typeof Waitlist>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>
}
