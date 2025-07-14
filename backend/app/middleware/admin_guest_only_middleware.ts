import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminGuestOnlyMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn) {
    await auth.use('admin').check()
    if(auth.use('admin').isAuthenticated){
      return response.forbidden("Already Logged In")
    }
    const output = await next()
    return output
  }
}