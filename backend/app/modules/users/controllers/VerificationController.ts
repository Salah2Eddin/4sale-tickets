import { HttpContext } from '@adonisjs/core/http'
import VerificationService from '#modules/users/services/VerificationService'

export default class VerificationController {
  async getVerification({ auth, response }: HttpContext) {
    const user = await auth.user!
    const verificationToken = await VerificationService.generateVerificationToken(user.id)
    VerificationService.sendTokenToUser(user.email, verificationToken)
    return response.ok({
      message: "Verification url sent"
    })
  }

  async verify({ params, auth, response }: HttpContext) {
    const token = await VerificationService.getToken(params.token)
    const user = await auth.user!
    if (!VerificationService.isValidToken(user.id, token)) {
      return response.status(400).send({
        code: 'E_INVALID_TOKEN',
        message: 'The verification token is invalid or has expired.',
      })
    }
    await VerificationService.verifyToken(token)
    await VerificationService.deleteToken(token)
    return response.ok({
      message: 'Verification successful',
    })
  }
}
