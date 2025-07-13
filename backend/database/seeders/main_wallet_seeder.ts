import User from '#modules/users/models/User'
import Wallet from '#modules/wallet/models/Wallet'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import { randomBytes } from 'crypto'

export default class extends BaseSeeder {
  async run() {
    db.transaction(async (trx) => {
      const user = await User.create(
        {
          id: 5,
          username: 'system-wallet',
          email: 'system.wallet@4sale.ticket',
          password: randomBytes(8).toString('hex'),
          isVerified: true,
        },
        { client: trx }
      )
      await Wallet.create(
        {
          id: 5,
          userId: user.id,
          balance: 1000000000,
        },
        { client: trx }
      )
    })
  }
}
