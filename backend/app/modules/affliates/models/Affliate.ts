import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#modules/users/models/User'

export default class AffiliateLink extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare eventId: number

  @column()
  declare userId: number 

  @column()
  declare code: string 
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
  
}