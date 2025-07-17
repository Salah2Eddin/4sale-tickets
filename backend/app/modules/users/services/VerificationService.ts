import { sendMail } from '#modules/shared/services/mail_service'
import VerificationToken from '#modules/users/models/VerificationToken'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'

const TOKEN_LENGTH = 8
const TOKEN_EXPIRY_MINUTES = 10

export default class VerificationService {
  static async generateVerificationToken(userId: number): Promise<VerificationToken> {
    const token = randomBytes(TOKEN_LENGTH / 2).toString('hex')
    const verificationToken = await VerificationToken.create({
      userId: userId,
      value: token,
    })
    return verificationToken
  }

  static isTokenExpired(token: VerificationToken): boolean {
    const tokenDT = DateTime.fromJSDate(token.createdAt)
    const delta = DateTime.now().diff(tokenDT)
    return delta.as('seconds') > TOKEN_EXPIRY_MINUTES * 60
  }

  static async getToken(tokenValue: string): Promise<VerificationToken> {
    return await VerificationToken.findByOrFail({ value: tokenValue })
  }

  static isTokenBelongsToUser(userId: number, token: VerificationToken): boolean {
    return token.userId == userId
  }

  static async deleteToken(token: VerificationToken) {
    await token.delete()
  }

  static sendTokenToUser(email: string, token: VerificationToken) {
    sendMail(email, '4Sale Tickets Verification token', [
      'Your verification token is:',
      token.value,
    ])
  }
}
