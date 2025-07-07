import { Authenticator } from "@adonisjs/auth"
import User from "#modules/users/models/User"
import { Authenticators } from "@adonisjs/auth/types"

export default class AuthService{
  static async login(email: string, password:string, auth: Authenticator<Authenticators>){
    const user = await User.verifyCredentials(email, password)
    return await auth.use('api').createToken(user)
  }

  static async logout(auth: Authenticator<Authenticators>){
    await auth.use('api').invalidateToken()
  }

  static async register(userData: { username: string; email: string; password: string }){
    const user = await User.create(userData)
    return user
  }
}