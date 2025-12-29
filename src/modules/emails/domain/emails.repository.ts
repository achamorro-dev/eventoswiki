import type { EmailTemplate } from './email-template'

export interface EmailsRepository {
  send(template: EmailTemplate): Promise<void>
}
