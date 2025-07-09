import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'

import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'


import Affiliate from '#modules/affliates/models/Affliate'
import Ticket from '#modules/tickets/models/Ticket'
import Wallet from '#modules/wallet/models/Wallet'
import { UserRole } from '#contracts/user/enums/UserRole'

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

  @column()
  declare isVerified: boolean

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @hasOne(() => Affiliate)
  declare affiliate: HasOne<typeof Affiliate>

  @hasOne(() => Wallet)
  declare wallet: HasOne<typeof Wallet>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
