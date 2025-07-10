import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare isSuper: boolean

  @column()
  declare abilities: string[]
}