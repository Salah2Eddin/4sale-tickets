import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tier from './Tier.js'

export default class Seat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tierId: number

  @belongsTo(() => Tier)
  declare tier: BelongsTo<typeof Tier>
}
