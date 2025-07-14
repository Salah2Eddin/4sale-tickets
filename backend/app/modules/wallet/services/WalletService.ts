import db from '@adonisjs/lucid/services/db'
import Wallet from '#modules/wallet/models/Wallet'
import Transaction from '#modules/wallet/models/Transaction'
import InsufficientFundsException from '#exceptions/wallet/insufficient_funds_exception'

export default class WalletService {
  public static async make(userId: number): Promise<Wallet> {
    const wallet = await Wallet.create({
      userId: userId,
      balance: 0.0,
    })
    return wallet
  }

  public static async getBalance(userId: number): Promise<number> {
    const wallet = await Wallet.findByOrFail({ userId: userId })
    return wallet.balance
  }

  public static async makeTransaction(fromUserId: number, toUserId: number, amount: number) {
    const trx = await db.transaction()
    try {
      const fromWallet = await Wallet.findByOrFail({ userId: fromUserId }, { client: trx })
      const toWallet = await Wallet.findByOrFail({ userId: toUserId }, { client: trx })

      if (fromWallet.balance < amount) {
        throw new InsufficientFundsException()
      }

      fromWallet.balance -= amount
      toWallet.balance += amount

      await Transaction.create(
        {
          fromId: fromWallet.id,
          toId: toWallet.id,
          amount: amount,
        },
        { client: trx }
      )
      await fromWallet.save()
      await toWallet.save()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  public static async addBalance(walletId: number, amount: number) {
    const SYSTEM_BALANCE_ID = 5
    const wallet = await Wallet.findOrFail(walletId)
    await this.makeTransaction(SYSTEM_BALANCE_ID, wallet.userId, amount)
  }

  public static async getWalletTransactions(walletId: number): Promise<Transaction[]> {
    const sentTransactions = await Transaction.query()
      .where("fromId", walletId)
      .orWhere("toId", walletId)
      .orderBy('date')
    return sentTransactions
  }

  public static async getUserTransactions(userId: number): Promise<Transaction[]> {
    const wallet = await Wallet.findByOrFail({ userId: userId })
    return await this.getWalletTransactions(wallet.id)
  }

  public static async getTransaction(transactionId: number): Promise<Transaction> {
    return await Transaction.findOrFail(transactionId)
  }


public static async deduct(userId: number, amount: number): Promise<boolean> {
  const wallet = await Wallet.findByOrFail({ userId })
  if (wallet.balance < amount) return false

  wallet.balance -= amount
  await wallet.save()
  return true
}
}
