import { Authenticator } from "@adonisjs/auth"
import User from "#modules/users/models/User"
import { Authenticators } from "@adonisjs/auth/types"
import UnverifiedUserExepction from "#exceptions/user/unverified_exception"
import UserService from "#modules/users/services/UserService"
import VerificationService from "#modules/users/services/VerificationService"

export default class AuthService{
  static async login(email: string, password:string, auth: Authenticator<Authenticators>){
    const user = await User.verifyCredentials(email, password)
    if (!user.isVerified){
      throw UnverifiedUserExepction
    }
    return await auth.use('api').createToken(user)
  }

  static async logout(auth: Authenticator<Authenticators>){
    await auth.use('api').invalidateToken()
  }

  static async register(username: string, email:string, password:string){
    const user = await UserService.createUser(username, email, password)
    const verificationToken = await VerificationService.generateVerificationToken(user.id)
    // send email with url to user (for now print to console)
    VerificationService.sendTokenToUser(user.email, verificationToken)
    return user
  }
}