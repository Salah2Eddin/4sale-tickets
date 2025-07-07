import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#modules/users/models/User'
import Transaction from './Transaction.js'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare balance: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(()=>Transaction)
  declare transactions: HasMany<typeof Transaction>
}