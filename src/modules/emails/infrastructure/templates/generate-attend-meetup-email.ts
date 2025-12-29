import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'
import { Datetime } from '@/shared/domain/datetime/datetime'

interface AttendMeetupEmailData {
  userName: string
  meetup: Meetup
  organization?: Organization
}

export function generateAttendMeetupEmailHtml(data: AttendMeetupEmailData): string {
  const { userName, meetup, organization } = data
  const meetupUrl = `https://eventos.wiki/meetups/${meetup.slug}`
  const logoUrl = 'https://eventos.wiki/logo.svg'

  const formattedDate = Datetime.toDateString(meetup.startsAt, 'dddd, D \\d\\e MMMM \\d\\e YYYY')
  const formattedTime = Datetime.toTimeString(meetup.startsAt, 'HH:mm')
  const endTime = Datetime.toTimeString(meetup.endsAt, 'HH:mm')

  const organizerSection = organization
    ? `
      <tr>
        <td style="border-top: 1px solid #e5e7eb; padding-top: 20px; padding-bottom: 16px;">
          <div style="font-size: 12px; font-weight: bold; color: #6b7280; margin-bottom: 12px;">Organizado por</div>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 16px;">
            <tr>
              ${
                organization.image
                  ? `<td style="width: 50px; padding-right: 12px;">
                <img src="${organization.image.toString()}" width="40" height="40" alt="${organization.name}" style="border-radius: 4px; object-fit: cover;">
              </td>`
                  : ''
              }
              <td>
                <div style="font-size: 14px; font-weight: bold; color: #1f2937; margin: 0;">${organization.name}</div>
                ${
                  organization.bio
                    ? `<div style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${organization.bio}</div>`
                    : ''
                }
              </td>
            </tr>
          </table>
          ${
            organization.web || organization.twitter || organization.linkedin || organization.instagram
              ? `
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 12px;">
            <tr>
              ${organization.web ? `<td style="padding-right: 12px;"><a href="${organization.web}" style="font-size: 12px; color: #3b82f6; text-decoration: none; font-weight: 500;">Web</a></td>` : ''}
              ${organization.twitter ? `<td style="padding-right: 12px;"><a href="${organization.twitter}" style="font-size: 12px; color: #3b82f6; text-decoration: none; font-weight: 500;">Twitter</a></td>` : ''}
              ${organization.linkedin ? `<td style="padding-right: 12px;"><a href="${organization.linkedin}" style="font-size: 12px; color: #3b82f6; text-decoration: none; font-weight: 500;">LinkedIn</a></td>` : ''}
              ${organization.instagram ? `<td style="padding-right: 12px;"><a href="${organization.instagram}" style="font-size: 12px; color: #3b82f6; text-decoration: none; font-weight: 500;">Instagram</a></td>` : ''}
            </tr>
          </table>
          `
              : ''
          }
        </td>
      </tr>
    `
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
    <!-- Header -->
    <tr>
      <td style="padding: 20px 0; text-align: center;">
        <img src="${logoUrl}" width="120" height="28" alt="EventosWiki" />
      </td>
    </tr>

    <!-- Saludo -->
    <tr>
      <td style="padding: 0 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0 0 10px 0;">¡Hola ${userName}!</h1>
        <p style="font-size: 16px; color: #6b7280; margin: 0 0 30px 0; line-height: 1.5;">Te has registrado correctamente en el siguiente meetup:</p>
      </td>
    </tr>

    <!-- Meetup Card -->
    <tr>
      <td style="padding: 0 20px; margin-bottom: 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
          <tr>
            <td>
              <span style="display: inline-block; background-color: ${meetup.tagColor || '#3b82f6'}; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 12px;">${meetup.type}</span>
            </td>
          </tr>
          <tr>
            <td>
              <h2 style="font-size: 20px; font-weight: bold; color: #1f2937; margin: 12px 0;">${meetup.title}</h2>
              <p style="font-size: 14px; color: #4b5563; margin: 12px 0; line-height: 1.6;">${meetup.shortDescription}</p>
            </td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #e5e7eb; padding-top: 20px; padding-bottom: 20px;">
              <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: bold; color: #6b7280; margin-bottom: 4px;">📅 Fecha y Hora</div>
                <div style="font-size: 14px; color: #1f2937; line-height: 1.5;">${formattedDate}<br />${formattedTime} - ${endTime}</div>
              </div>
              ${
                meetup.location
                  ? `
              <div style="margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: bold; color: #6b7280; margin-bottom: 4px;">📍 Ubicación</div>
                <div style="font-size: 14px; color: #1f2937;">${meetup.location}</div>
              </div>
              `
                  : ''
              }
            </td>
          </tr>
          ${organizerSection}
        </table>
      </td>
    </tr>

    <!-- Button -->
    <tr>
      <td style="padding: 0 20px 30px 20px; text-align: center;">
        <a href="${meetupUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 30px; font-size: 14px; font-weight: bold; border-radius: 6px; text-decoration: none;">Ver detalles del evento</a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; margin: 8px 0;">Este es un correo automático, por favor no responda a este mensaje.</p>
        <p style="font-size: 12px; color: #6b7280; margin: 8px 0;">© 2024 EventosWiki. Todos los derechos reservados.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
