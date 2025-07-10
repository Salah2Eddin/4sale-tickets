import { HttpContext } from '@adonisjs/core/http'

export default class AdminAccessMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>, abilities: string[]) {
    const admin = ctx.auth.user

    if (!admin || !this.hasAbility(admin, abilities)) {
      return ctx.response.unauthorized({ message: 'Access denied' })
    }

    await next()
  }

  private hasAbility(admin: any, abilities: string[]): boolean {
    if (admin.isSuper) return true

    for (const ability of abilities) {
      if (admin.abilities.includes(ability) || admin.abilities.includes('*')) {
        return true
      }
    }

    return false
  }
}