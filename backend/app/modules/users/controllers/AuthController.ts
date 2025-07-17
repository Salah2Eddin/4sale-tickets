import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#modules/users/services/AuthService'
import {
  forgetPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from '#modules/users/validators/AuthValidators'
import VerificationService from '#modules/users/services/VerificationService'
import UserService from '#modules/users/services/UserService'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class AuthController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = await loginValidator.validate(request.all())
    return AuthService.login(email, password, auth)
  }

  async logout({ auth }: HttpContext) {
    AuthService.logout(auth)
  }

  async register({ request, response }: HttpContext) {
    const { username, email, password } = await registerValidator.validate(request.all())
    try {
      const user = await AuthService.register(username, email, password)
      return response.status(201).json({
        message: 'User registered',
        userId: user.id,
      })
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        return response.conflict({
          message: 'Username or email already exists',
        })
      }
    }
  }

  async forgetPassword({ request, response }: HttpContext) {
    const { email } = await forgetPasswordValidator.validate(request.all())
    try {
      const user = await UserService.getUserFromEmail(email)
      const verificationToken = await VerificationService.generateVerificationToken(user.id)
      await VerificationService.sendTokenToUser(email, verificationToken)
    } catch (error) {
      if (!(error instanceof lucidErrors.E_ROW_NOT_FOUND)) {
        throw error
      }
    }
    return response.ok({ message: 'Reset password token sent to user if user exists' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { email, verificationCode, newPassword } = await resetPasswordValidator.validate(
      request.all()
    )
    const user = await UserService.getUserFromEmail(email)

    let token
    try {
      token = await VerificationService.getToken(verificationCode)
    } catch (error) {
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

    await AuthService.changePassword(user, newPassword)
    await VerificationService.deleteToken(token)
    return response.noContent()
  }
}
