import { Resend } from 'resend'
import type { EmailTemplate } from '../../domain/email-template'
import type { EmailsRepository } from '../../domain/emails.repository'

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY as string

const SENDER_EMAIL = 'noreply@eventos.wiki'
const SENDER_NAME = 'EventosWiki'
const MAX_RETRIES = 3
const RETRY_DELAYS = [0, 100, 200] // milliseconds

export class ResendEmailsRepository implements EmailsRepository {
  private readonly resend: Resend

  constructor() {
    this.resend = new Resend(RESEND_API_KEY)
  }

  async send(template: EmailTemplate): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Esperar antes de reintentar (excepto en el primer intento)
        if (attempt > 1) {
          await this.delay(RETRY_DELAYS[attempt - 1])
        }

        await this.resend.emails.send({
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: template.recipient,
          subject: template.subject,
          html: template.html,
          attachments: template.attachments,
        })

        // Si llegamos aquí, el email se envió exitosamente
        return
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(`Unknown error on attempt ${attempt}`)

        console.error(
          `[Emails] Attempt ${attempt}/${MAX_RETRIES} failed for ${template.recipient}: ${lastError.message}`,
        )

        // Si es el último intento, no reintentar más
        if (attempt === MAX_RETRIES) {
          break
        }
      }
    }

    // Log final del error sin lanzar excepción para no interrumpir el flujo principal
    console.error(
      `[Emails] Failed to send email to ${template.recipient} after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`,
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
