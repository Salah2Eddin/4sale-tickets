import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#modules/users/services/AuthService'
import {loginValidator, registerValidator} from '#modules/users/validators/AuthValidators'

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
    const user = await AuthService.register(username, email, password)
    return response.status(201).json({
      message: 'User registered',
      userId: user.id
    })
  }
}