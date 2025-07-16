import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'

import { DbAccessTokensProvider,  } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password'
})

export default class Admin extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare isSuper: boolean

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => value,
  })
  declare abilities: string[]

  static accessTokens = DbAccessTokensProvider.forModel(Admin, { table: "admin_access_tokens" })

}