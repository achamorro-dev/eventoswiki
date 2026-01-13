import { Body, Button, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import type { Meetup } from '@/meetups/domain/meetup'
import type { Organization } from '@/organizations/domain/organization'

interface OrganizationMeetupCreatedEmailProps {
  userName: string
  meetup: Meetup
  organization: Organization
  meetupUrl: string
}

export function OrganizationMeetupCreatedEmail({
  userName,
  meetup,
  organization,
  meetupUrl,
}: OrganizationMeetupCreatedEmailProps) {
  const formattedDate = meetup.startsAt.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = meetup.startsAt.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const endTime = meetup.endsAt.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Html>
      <Head />
      <Preview>
        {organization.name} ha creado un nuevo meetup: {meetup.title}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-2xl">
            <Section className="px-5">
              <Img src={meetup.image.toString()} alt={meetup.title} className="mb-6 w-full rounded-lg" />
            </Section>

            <Section className="px-5">
              <Text className="mb-3 font-bold text-2xl text-gray-900">¡Hola {userName}!</Text>
              <Text className="text-base text-gray-700">
                <span className="font-bold text-gray-900">{organization.name}</span> ha creado un nuevo meetup que te
                puede interesar:
              </Text>
            </Section>

            <Section className="px-5 py-8">
              <Container className="rounded-lg bg-white p-6 shadow-sm">
                <Section className="mb-3">
                  <Text
                    className="m-0 inline-block rounded px-3 py-1.5 font-bold text-white text-xs"
                    style={{ backgroundColor: meetup.tagColor || '#3b82f6' }}
                  >
                    {meetup.type.value}
                  </Text>
                </Section>

                <Section className="mb-5">
                  <Text className="mt-0 mb-2 font-bold text-gray-900 text-xl">{meetup.title}</Text>
                  <Text className="my-3 text-gray-700 text-sm leading-6">{meetup.shortDescription}</Text>
                </Section>

                <Hr className="border-gray-200 py-2" />
                <Section>
                  <Text className="mb-1 font-bold text-gray-600 text-xs">📅 Fecha y Hora</Text>
                  <Text className="my-2 text-gray-900 text-sm">{formattedDate}</Text>
                  <Text className="my-2 text-gray-900 text-sm">
                    {formattedTime} - {endTime}
                  </Text>
                </Section>

                {meetup.location && (
                  <Section className="mt-4">
                    <Text className="mb-1 font-bold text-gray-600 text-xs">📍 Ubicación</Text>
                    <Text className="my-2 text-gray-900 text-sm">{meetup.getFullLocation()}</Text>
                  </Section>
                )}

                <Hr className="border-gray-200 py-2" />
                <Section>
                  <Text className="mb-3 font-bold text-gray-600 text-xs">Organizado por</Text>
                  <Section className="flex gap-3">
                    {organization.image && (
                      <Img
                        src={organization.image.toString()}
                        alt={organization.name}
                        width={40}
                        height={40}
                        className="rounded"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Section>
                  <Section>
                    <Text className="m-0 font-bold text-gray-900">{organization.name}</Text>
                    {organization.bio && <Text className="mt-1 text-gray-600 text-xs">{organization.bio}</Text>}
                  </Section>

                  {(organization.web || organization.twitter || organization.linkedin || organization.instagram) && (
                    <Section className="mt-3 flex gap-3">
                      {organization.web && (
                        <Link
                          href={organization.web}
                          className="font-medium text-blue-600 text-xs no-underline hover:underline"
                        >
                          Web
                        </Link>
                      )}
                      {organization.twitter && (
                        <Link
                          href={organization.twitter}
                          className="font-medium text-blue-600 text-xs no-underline hover:underline"
                        >
                          Twitter
                        </Link>
                      )}
                      {organization.linkedin && (
                        <Link
                          href={organization.linkedin}
                          className="font-medium text-blue-600 text-xs no-underline hover:underline"
                        >
                          LinkedIn
                        </Link>
                      )}
                      {organization.instagram && (
                        <Link
                          href={organization.instagram}
                          className="font-medium text-blue-600 text-xs no-underline hover:underline"
                        >
                          Instagram
                        </Link>
                      )}
                    </Section>
                  )}
                </Section>
              </Container>
            </Section>

            <Section className="px-5 py-6 text-center">
              <Button
                href={meetupUrl}
                className="rounded-lg bg-primary px-8 py-3 text-center font-bold text-primary-foreground text-sm no-underline"
              >
                Ver detalles del evento
              </Button>
            </Section>
          </Container>
          <Section className="border-gray-200 border-t bg-gray-100 px-5 py-5 text-center">
            <Section className="mx-auto max-w-2xl py-5 text-center">
              <Img
                src={'https://eventos.wiki/logo.png'}
                alt={'EventosWiki'}
                style={{ maxWidth: '250px', height: 'auto', margin: '0 auto' }}
              />
            </Section>
            <Text className="m-2 mx-auto text-gray-600 text-xs">
              Este es un correo automático, por favor no responda a este mensaje.
            </Text>
            <Text className="m-2 mx-auto text-gray-600 text-xs">
              © 2024 EventosWiki. Todos los derechos reservados.
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
