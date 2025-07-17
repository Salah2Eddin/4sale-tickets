import { HttpContext } from '@adonisjs/core/http'
import VerificationService from '#modules/users/services/VerificationService'
import UserService from '#modules/users/services/UserService'
import { verificationRequestValidator } from '#modules/users/validators/VerificationValidators'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { isUser } from '#modules/shared/services/type_guards'
import NotUserException from '#exceptions/not_user_exception'

export default class VerificationController {
  async getVerification({ auth, response }: HttpContext) {
    const user = auth.user!
    if (!isUser(user)) {
      throw new NotUserException()
    }
    const verificationToken = await VerificationService.generateVerificationToken(user.id)
    VerificationService.sendTokenToUser(user.email, verificationToken)
    return response.ok({
      message: 'Verification code sent',
    })
  }

  async verify({ request, auth, response }: HttpContext) {
    const user = auth.user!
    if (!isUser(user)) {
      throw new NotUserException()
    }

    if (user.isVerified) {
      return response.badRequest({ message: "User is already verified" })
    }

    const { code } = await verificationRequestValidator.validate(request.all())
    let token
    try {
      token = await VerificationService.getToken(code)
    }
    catch (error) {
      if (!(error instanceof lucidErrors.E_ROW_NOT_FOUND)) {
        throw error
      }
      return response.badRequest({ message: "Invalid verification token" })
    }

    if (VerificationService.isTokenExpired(token)) {
      return response.status(400).send({
        code: 'E_INVALID_TOKEN',
        message: 'Expired verification token.',
      })
    }

    if (!VerificationService.isTokenBelongsToUser(user.id, token)) {
      return response.status(400).send({
        code: 'E_INVALID_TOKEN',
        message: 'Verification token doesn\'t belong to user.',
      })
    }

    await UserService.verifyUser(user.id)
    await VerificationService.deleteToken(token)
    return response.ok({
      message: 'Verification successful',
    })
  }
}
