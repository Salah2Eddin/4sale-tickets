import Transaction from '#modules/wallet/models/Transaction'

type transactionDTO = {
  id: number,
  fromUserId: number,
  toUserId: number,
  amount: number
}

export default class TransactionsMapper {
  public static async mapTransactionToDTO(transaction: Transaction): Promise<transactionDTO> {
    await transaction.load('fromWallet')
    await transaction.load('toWallet')
    return {
      id: transaction.id,
      fromUserId: transaction.fromWallet.userId,
      toUserId: transaction.toWallet.userId,
      amount: transaction.amount,
    }
  }

  public static mapTransactions(transactions: Transaction[]): Promise<transactionDTO[]>{
    return Promise.all(transactions.map(this.mapTransactionToDTO))
  }
}
