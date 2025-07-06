import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import Affiliate from '../../affliates/models/Affliate.js'
import Ticket from '../../tickets/models/Ticket.js'
import Wallet from '../../wallet/models/Wallet.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @hasOne(() => Affiliate)
  declare affiliate: HasOne<typeof Affiliate>

  @hasOne(() => Wallet)
  declare wallet: HasOne<typeof Wallet>
}
