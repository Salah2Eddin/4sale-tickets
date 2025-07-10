import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestOnlyMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn) {
    const user = auth.user

    if (user){
      return response.unauthorized("You already logged in")
    }

    const output = await next()
    return output
  }
}