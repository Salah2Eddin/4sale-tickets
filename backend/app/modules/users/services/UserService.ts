import db from '@adonisjs/lucid/services/db'
import User from '#modules/users/models/User'
import Wallet from '#modules/wallet/models/Wallet'
export default class UserService {
  static async createUser(username: string, email: string, password: string) {
    return await db.transaction(async (trx) => {
      const user = await User.create(
        {
          username: username,
          email: email,
          password: password,
        },
        { client: trx }
      )
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

  static async verifyUser(userId: number) {
    await User.query().where({id: userId}).update({isVerified: true})
  }

  static async getUserFromEmail(email: string) {
    return await User.findByOrFail({ email: email })
  }
}
