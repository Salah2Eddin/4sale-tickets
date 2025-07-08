import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#modules/users/models/User'
import Waitlist from '#modules/waitlist/models/Waitlist'
import Ticket from '#modules/tickets/models/Ticket'
import { DateTime } from 'luxon'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizerId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare location: string

  @column()
  declare basePrice: number

  @column()
  declare currency: string

  @column()
  declare capacity: number

  @column()
  declare isSoldOut: boolean

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @column.dateTime()
  declare earlyBirdEndsAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'organizerId' })
  declare organizer: BelongsTo<typeof User>

  @hasOne(() => Waitlist)
  declare waitlist: HasOne<typeof Waitlist>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>
}