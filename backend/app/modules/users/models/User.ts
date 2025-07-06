import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'

import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'


import Affiliate from '../../affliates/models/Affliate.js'
import Ticket from '../../tickets/models/Ticket.js'
import Wallet from '../../wallet/models/Wallet.js'
import { UserRole } from 'contracts/user/enums/UserRole.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare role: UserRole

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @hasOne(() => Affiliate)
  declare affiliate: HasOne<typeof Affiliate>

  @hasOne(() => Wallet)
  declare wallet: HasOne<typeof Wallet>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
