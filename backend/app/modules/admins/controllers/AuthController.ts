import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#modules/admins/services/AuthService'
import {
  loginValidator,
} from '#modules/admins/validators/AuthValidators'

export default class AuthController {
  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    return AuthService.login(email, password)
  }

  async logout({ auth }: HttpContext) {
    AuthService.logout(auth)
  }
}
