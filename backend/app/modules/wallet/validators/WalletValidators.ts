import vine from '@vinejs/vine'

export const idValidatorExpression = vine.number().positive().withoutDecimals()
export const amountValidatorExpression = vine.number().positive().decimal([0, 2]).min(1)

export const idValidator = vine.compile(idValidatorExpression)
export const rechargeValidator = vine.compile(
    vine.object({
        amount: amountValidatorExpression
    })
)
export const transactionValidator = vine.compile(
  vine.object({
    to: idValidatorExpression,
    amount: amountValidatorExpression
  })
)

