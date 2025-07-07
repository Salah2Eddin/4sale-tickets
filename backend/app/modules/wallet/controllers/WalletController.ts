import { HttpContext } from '@adonisjs/core/http'

export default class WalletController {
  async balance({ auth, response }: HttpContext) {
    const user = auth.user
    await user?.load('wallet')
    return response.status(200).json({
        "userid":user?.id,
        "balance": user?.wallet.balance
    })
  }
}