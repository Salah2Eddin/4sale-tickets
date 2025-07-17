import { HttpContext } from '@adonisjs/core/http'
import WalletService from '#modules/wallet/services/WalletService'
import TransactionsMapper from '#modules/wallet/mappers/TransactionMapper'
import {
  idValidator,
  rechargeValidator,
} from '#modules/wallet/validators/WalletValidators'
import { isUser } from '#modules/shared/services/type_guards'
import NotUserException from '#exceptions/not_user_exception'

export default class WalletController {
  async balance({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!isUser(user)) {
      throw new NotUserException()
    }
    const balance = await WalletService.getBalance(user.id)
    return response.status(200).json({
      balance: balance,
    })
  }

  async transactions({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!isUser(user)) {
      throw new NotUserException()
    }

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
    if (!isUser(user)) {
      throw new NotUserException()
    }

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
    if (!isUser(user)) {
      throw new NotUserException()
    }

    await user.load('wallet')
    await WalletService.addBalance(user.wallet.id, amount)
    await user.wallet.refresh()
    return response.status(201).json({
      newBalance: user.wallet.balance,
    })
  }
}
