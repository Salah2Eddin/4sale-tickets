import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckAdminAbilityMiddleware {
  async handle({auth, response}: HttpContext, next: NextFn, abilities: string[]) {
    await auth.use('admin').authenticate()
    const admin = auth.use('admin').user!
    const adminAbilities = admin.abilities

    if(adminAbilities.includes("*")){
      // Super Admin
      return await next()
    }

    if(! adminAbilities.some(abilities.includes)){
      return response.forbidden("You don't have permission to access this")
    }

    const output = await next()
    return output
  }
}