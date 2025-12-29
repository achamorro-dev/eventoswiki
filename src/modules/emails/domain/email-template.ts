export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType?: string
}

export interface EmailTemplate {
  recipient: string
  subject: string
  html: string
  attachments?: EmailAttachment[]
}
