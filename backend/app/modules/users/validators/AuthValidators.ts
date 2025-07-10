import vine from '@vinejs/vine'

const usernameValidatorExpression = vine.string().alphaNumeric().minLength(8).maxLength(20)
const emailValidatorExpression = vine.string().email().maxLength(200)
const passwordValidatorExpression = vine.string().alphaNumeric().minLength(8).maxLength(20)

export const loginValidator = vine.compile(
  vine.object({
    email: emailValidatorExpression,
    password: passwordValidatorExpression,
  })
)
export const registerValidator = vine.compile(
  vine.object({
    username: usernameValidatorExpression,
    email: emailValidatorExpression,
    password: passwordValidatorExpression,
  })
)

export const forgetPasswordValidator = vine.compile(
  vine.object({
    email: emailValidatorExpression,
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: emailValidatorExpression,
    verificationCode: vine.string().minLength(8).maxLength(8),
    newPassword: passwordValidatorExpression,
    newPasswordConfirmation: vine.string().confirmed({ confirmationField: 'newPassword' }),
  })
)
