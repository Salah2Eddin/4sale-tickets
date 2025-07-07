import db from "@adonisjs/lucid/services/db";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export default class WalletService {
  public static async make(userId: number): Promise<Wallet> {
    const wallet = await Wallet.create({
        userId: userId,
        balance: 0.0,
    })
    return wallet
  }

  public static async pay(fromUserId:number, toUserId:number, amount:number) {
    const trx = await db.transaction()
    try{
      const fromWallet = await Wallet.findByOrFail({"userId": fromUserId}, {client: trx})
      const toWallet = await Wallet.findByOrFail({"userId": toUserId}, {client: trx})

      if(fromWallet.balance < amount){
        throw new Error("Inssuficient Balance")
      }
      
      fromWallet.balance -= amount
      toWallet.balance += amount

      const transaction = await Transaction.create({
        fromId: fromWallet.id,
        toId: toWallet.id,
        amount: amount
      })
      transaction.useTransaction(trx)

      await fromWallet.save()
      await toWallet.save()
      await trx.commit()
    }catch{
      await trx.rollback()
    }
  }

}