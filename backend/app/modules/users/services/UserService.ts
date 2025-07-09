import db from '@adonisjs/lucid/services/db'
import User from '#modules/users/models/User'
import Wallet from '#modules/wallet/models/Wallet'
export default class UserService {
  static async createUser(userData: { username: string; email: string; password: string }) {
    return await db.transaction(async (trx) => {
      const user = await User.create(userData, { client: trx })
      await Wallet.create(
        {
          userId: user.id,
          balance: 0.0,
        },
        { client: trx }
      )
      return user
    })
  }
}
