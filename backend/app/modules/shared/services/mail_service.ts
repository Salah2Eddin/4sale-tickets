import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export async function sendMail(to: string, subject: string, content: string[]) {
  await mail.send((message) => {
    message
      .to(to)
      .from(env.get('SMTP_USERNAME'))
      .subject(subject)
      .text(
        content.reduce((prev, cur, _idx, _arr) => {
          if (prev.length == 0) prev = cur
          else prev = prev + '\n' + cur
          return prev
        })
      )
  })
}
