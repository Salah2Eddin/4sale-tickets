import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestOnlyMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn) {
    await auth.use('api').check()
    if (auth.isAuthenticated){
      return response.forbidden("Already Logged In")
    }

    const output = await next()
    return output
  }
}