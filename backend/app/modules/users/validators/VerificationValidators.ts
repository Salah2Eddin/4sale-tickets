import vine from "@vinejs/vine";

export const verificationRequestValidator = vine.compile(
    vine.object({
        code: vine.string().minLength(8).maxLength(8)
    })
)