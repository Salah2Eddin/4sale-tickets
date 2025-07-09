import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#modules/users/services/AuthService'
import UserService from '#modules/users/services/UserService'

export default class AuthController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    return AuthService.login(email, password, auth)
  }

  async logout({ auth }: HttpContext) {
    AuthService.logout(auth)
  }

  async register({ request, response }: HttpContext) {
    const { username, email, password } = request.only(['username', 'email', 'password']);
    const user = await UserService.createUser({ username, email, password })
    return response.status(201).json({
      message: 'User registered',
      userId: user.id
    })
  }
}