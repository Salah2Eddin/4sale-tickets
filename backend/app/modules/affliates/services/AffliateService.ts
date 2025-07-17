import AffiliateLink from '#modules/affliates/models/Affliate'
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
}
