import { HttpContext } from '@adonisjs/core/http'
import VerificationService from '#modules/users/services/VerificationService'
import UserService from '#modules/users/services/UserService'
import { verificationRequestValidator } from '#modules/users/validators/VerificationValidators'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class VerificationController {
  async getVerification({ auth, response }: HttpContext) {
    const user = await auth.user!
    const verificationToken = await VerificationService.generateVerificationToken(user.id)
    VerificationService.sendTokenToUser(user.email, verificationToken)
    return response.ok({
      message: 'Verification code sent',
    })
  }

  async verify({ request, auth, response }: HttpContext) {
    const { code } = await verificationRequestValidator.validate(request.all())
    let token
    try{
    token = await VerificationService.getToken(code)}
    catch(error){
      if(! (error instanceof lucidErrors.E_ROW_NOT_FOUND)){
        throw error
      }
      return response.badRequest()
    }
    const user = auth.user!
    if (!VerificationService.isValidToken(user.id, token)) {
      return response.status(400).send({
        code: 'E_INVALID_TOKEN',
        message: 'The verification token is invalid or has expired.',
      })
    }
    await UserService.verifyUser(user.id)
    await VerificationService.deleteToken(token)
    return response.ok({
      message: 'Verification successful',
    })
  }
}
