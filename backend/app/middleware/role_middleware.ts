import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn, roles: string[]) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    if (!roles.includes(user.role)) {
      return response.forbidden({ message: 'Access denied' })
    }

    return next()
  }
}