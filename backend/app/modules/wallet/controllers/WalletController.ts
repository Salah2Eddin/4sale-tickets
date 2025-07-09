import { HttpContext } from '@adonisjs/core/http'
import WalletService from '#modules/wallet/services/WalletService'
import TransactionsMapper from '#modules/wallet/mappers/TransactionMapper'
import {
  transactionValidator,
  idValidator,
  rechargeValidator,
} from '#modules/wallet/validators/WalletValidators'

export default class WalletController {
  async balance({ auth, response }: HttpContext) {
    const user = auth.user!
    const balance = await WalletService.getBalance(user.id)
    return response.status(200).json({
      balance: balance,
    })
  }

  async makeTransaction({ request, auth, response }: HttpContext) {
    const { to, amount } = await transactionValidator.validate(request.all())
    const user = auth.user!
    await WalletService.makeTransaction(user.id, to, amount)

    return response.status(201).json({
      message: 'Successful transaction',
      newBalance: WalletService.getBalance(user.id),
    })
  }

  async transactions({ auth, response }: HttpContext) {
    const user = auth.user!
    const transactions = await TransactionsMapper.mapTransactions(
      await WalletService.getUserTransactions(user.id)
    )
    return response.status(200).json({
      transactions: transactions,
    })
  }

  async transaction({ params, auth, response }: HttpContext) {
    const transactionId = await idValidator.validate(params.id)
    const user = auth.user!
    const transaction = await WalletService.getTransaction(transactionId)

    const mappedTransaction = await TransactionsMapper.mapTransactionToDTO(transaction)

    if (user.id != mappedTransaction.fromUserId && user.id != mappedTransaction.toUserId) {
      return response.unauthorized()
    }

    return response.status(200).json(mappedTransaction)
  }

  async rechargeBalance({ request, auth, response }: HttpContext) {
    const { amount } = await rechargeValidator.validate(request.all())

    const user = auth.user!
    await user.load('wallet')
    await WalletService.addBalance(user.wallet.id, amount)
    await user.wallet.refresh()
    return response.status(201).json({
      newBalance: user.wallet.balance,
    })
  }
}
