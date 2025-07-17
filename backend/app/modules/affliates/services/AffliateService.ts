import AffiliateLink from '#modules/affliates/models/Affliate'
import WalletService, { SYSTEM_WALLET_ID } from '#modules/wallet/services/WalletService'
import crypto from 'crypto'

export default class AffiliateService {
    public static async createLink(userId: number, eventId: number) {
    const code = crypto.randomBytes(4).toString('hex')

    const link = await AffiliateLink.create({
        userId,
        eventId,
        code,
    })

    return link
    }

    public static async getAffiliateUserId(code: string): Promise<number | null> {
    const link = await AffiliateLink.query().where('code', code).first()
    return link ? link.userId : null
    }

    public static async applyComission(price:number, affliateCode: string, options?:{client?:any}){
      const COMISSION_PERC = 0.1
      const affliate = await this.getAffiliateUserId(affliateCode)
      if(!affliate){
        throw new Error("affliate code not correct")
      }
      await WalletService.makeTransaction(SYSTEM_WALLET_ID, affliate, price*COMISSION_PERC, options)
    }
}
