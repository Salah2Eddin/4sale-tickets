import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Wallet from './Wallet.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fromId: number

  @column()
  declare toId: number

  @column()
  declare amount: number
  
  @column.dateTime({autoCreate: true})
  declare date: DateTime

  @belongsTo(() => Wallet)
  declare fromWallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Wallet)
  declare toWallet: BelongsTo<typeof Wallet>
}