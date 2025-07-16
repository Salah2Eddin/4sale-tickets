import { Authenticator } from "@adonisjs/auth"
import Admin from "#modules/admins/models/Admin"
import { Authenticators } from "@adonisjs/auth/types"

export default class AuthService{
  static async login(email: string, password:string){
    const admin = await Admin.verifyCredentials(email, password)
    return await Admin.accessTokens.create(admin)
  }

  static async logout(auth: Authenticator<Authenticators>){
    await auth.use('admin').invalidateToken()
  }

  static async changePassword(user: Admin, newPassword: string){
    user.password = newPassword
    await user.save()
  }
}