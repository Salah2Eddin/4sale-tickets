import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from '#modules/users/models/User'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class VerificationToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare createdAt: DateTime

  @column()
  declare value: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
