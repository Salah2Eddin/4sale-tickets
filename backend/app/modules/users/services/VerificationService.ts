import MailService from '#modules/shared/services/mail_service'
import User from '#modules/users/models/User'
import VerificationToken from '#modules/users/models/VerificationToken'
import { randomBytes } from 'crypto'
import { DateTime } from 'luxon'

const TOKEN_LENGTH = 8
const TOKEN_EXPIRY_MINUTES = 10

export default class VerificationService {
  static async generateVerificationToken(userId: number): Promise<VerificationToken> {
    const token = randomBytes(TOKEN_LENGTH/2).toString('hex')
    const verificationToken = await VerificationToken.create({
      userId: userId,
      value: token,
    })
    return verificationToken
  }

  static isTokenExpired(token: VerificationToken): boolean {
    return DateTime.now().diff(token.createdAt).as('second') <= TOKEN_EXPIRY_MINUTES * 60
  }

  static async getToken(tokenValue: string): Promise<VerificationToken> {
    return await VerificationToken.findByOrFail({ value: tokenValue })
  }

  static isValidToken(userId: number, token: VerificationToken): boolean {
    if (this.isTokenExpired(token)) {
      return false
    }
    return token.userId == userId
  }

  static async verifyToken(token: VerificationToken) {
    const user = await User.findOrFail(token.userId)
    user.isVerified = true
    await user.save()
  }

  static async deleteToken(token: VerificationToken) {
    await token.delete()
  }

  static sendTokenToUser(email: string, token: VerificationToken) {
    MailService.send(email, [
      'Your verification token is:',
      token.value,
    ])
  }
}
