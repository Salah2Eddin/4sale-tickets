import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class verificationMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user!

    if (user.isVerified == false) {
      return response.forbidden()
    }

    const output = await next()
    return output
  }
}
