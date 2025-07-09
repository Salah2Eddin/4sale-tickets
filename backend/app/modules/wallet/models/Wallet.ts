import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#modules/users/models/User'
import Transaction from '#modules/wallet/models/Transaction'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare _balance: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(()=>Transaction)
  declare transactions: HasMany<typeof Transaction>


  public get balance(): number {
    return Number(this._balance)
  }

  public set balance(value: number) {
    this._balance = value
  }
}