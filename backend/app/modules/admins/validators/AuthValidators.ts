import vine from "@vinejs/vine";

const emailValidatorExpression = vine.string().email().maxLength(200)
const passwordValidatorExpression = vine.string().alphaNumeric().minLength(8).maxLength(20)

export const loginValidator = vine.compile(
  vine.object({
    email: emailValidatorExpression,
    password: passwordValidatorExpression,
  })
)