import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import TierDiscount from './TierDiscount.js'
import Seat from '@modules/tickets/models/Seat.js'

export default class Tier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare price: number

  @hasMany(() => TierDiscount)
  declare discounts: HasMany<typeof TierDiscount>

  @hasMany(() => Seat)
  declare seats: HasMany<typeof Seat>
}
