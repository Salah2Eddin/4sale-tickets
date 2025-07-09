import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export default class m {
  static async send(to: string, content: string[]) {
    // not working for some reason!

    await mail.send((message) => {
      message
        .to(to)
        .from(env.get('SMTP_USERNAME'))
        .subject('Verify your email address')
        .text(
          content.reduce((prev, cur, _idx, _arr) => {
            if (prev.length == 0) prev = cur
            else prev = prev + '\n' + cur
            return prev
          })
        )
    })
  }
}
