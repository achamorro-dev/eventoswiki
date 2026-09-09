import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

const BRAND_DARK = '#191210'
const BRAND_GREEN = '#217966'
const CANVAS_BG = '#FAF9F7'
const CARD_BG = '#FFFFFF'
const FOOTER_BG = '#F1EFEC'
const TEXT_BODY = '#55504B'
const TEXT_MUTED = '#7A736D'
const BORDER_SOFT = '#E7E4E0'
const BRAND_FONT = "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif"

export function CommunityAnnouncementEmail() {
  const eventosWikiUrl = 'https://eventos.wiki'
  const sirviendoCodigoUrl = 'https://sirviendocodigo.com'
  const notificationsUrl = 'https://eventos.wiki/me/settings/notifications'
  const twitterUrl = 'https://x.com/achamorro_dev'
  const blogPostUrl = 'https://sirviendocodigo.com/blog/cumplimos-dos-anos-y-ya-era-hora-de-ensenarte-todo-lo-que-somos'

  return (
    <Html lang="es">
      <Head />
      <Preview>Una decisión que llevaba tiempo madurando: eventos.wiki pasa a la comunidad</Preview>
      <Tailwind>
        <Body
          className="font-sans"
          style={{ backgroundColor: CANVAS_BG, fontFamily: BRAND_FONT, margin: 0, padding: 0 }}
        >
          <Container className="mx-auto max-w-2xl" style={{ padding: '40px 20px' }}>
            <Section className="text-center">
              <Img
                src="https://eventos.wiki/logo-by-sc.png"
                alt="eventos.wiki by sirviendo.código"
                width={220}
                style={{ height: 'auto', margin: '0 auto' }}
              />
            </Section>

            <Section
              className="rounded-2xl"
              style={{
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER_SOFT}`,
                marginTop: 32,
                padding: '40px 36px',
              }}
            >
              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 0 }}>¡Hola!</Text>

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>
                Te escribo para contarte una noticia que llevo tiempo queriendo dar:{' '}
                <strong style={{ color: BRAND_GREEN }}>eventos.wiki</strong> pasa a formar parte de la comunidad{' '}
                <strong style={{ color: BRAND_GREEN }}>Sirviendo Código</strong>.
              </Text>

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>
                Este proyecto nació para resolver un problema que veía una y otra vez: los meetups y eventos de
                tecnología estaban repartidos por mil sitios. Quería un único lugar donde encontrarlo todo, gratuito y
                abierto para todo el mundo.
              </Text>

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>
                Por el camino, algunas personas de la comunidad han participado en el proyecto, pero la responsabilidad,
                el tiempo y el trabajo acababan recayendo siempre en una sola persona.
              </Text>

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>
                Por eso damos el paso natural para que siga creciendo: ahora eventos.wiki crece en equipo.
              </Text>

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 12 }}>
                ¿Y qué es <span style={{ color: BRAND_GREEN }}>Sirviendo Código</span>? Una comunidad que lleva dos años
                recorriendo eventos, grabando charlas, entrevistando a ponentes y organizando meetups para que el
                conocimiento que se comparte de forma altruista llegue mucho más lejos. Aquí te lo cuentan mejor que yo:{' '}
                <Link href={blogPostUrl} style={{ color: BRAND_GREEN, fontWeight: 600, textDecoration: 'underline' }}>
                  «Cumplimos dos años. Y ya era hora de enseñarte todo lo que somos»
                </Link>
                .
              </Text>

              <Section
                className="rounded-xl"
                style={{
                  backgroundColor: CANVAS_BG,
                  border: `1px solid ${BORDER_SOFT}`,
                  marginTop: 28,
                  padding: '20px 24px',
                }}
              >
                <Text
                  style={{
                    color: BRAND_GREEN,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  Qué cambia
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
                  El mantenimiento, las decisiones y la hoja de ruta pasan a la comunidad{' '}
                  <span style={{ color: BRAND_GREEN }}>Sirviendo Código</span>. Si quieres contribuir, la puerta está
                  más abierta que nunca.
                </Text>
              </Section>

              <Section
                className="rounded-xl"
                style={{
                  backgroundColor: CANVAS_BG,
                  border: `1px solid ${BORDER_SOFT}`,
                  marginTop: 14,
                  padding: '20px 24px',
                }}
              >
                <Text
                  style={{
                    color: BRAND_GREEN,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  Qué no cambia
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
                  Tu cuenta, tus eventos, tus organizaciones y tus meetups siguen exactamente igual. La web sigue en
                  eventos.wiki, gratuita y abierta para todo el mundo.
                </Text>
              </Section>

              <Section
                className="rounded-xl"
                style={{
                  backgroundColor: CANVAS_BG,
                  border: `1px solid ${BORDER_SOFT}`,
                  marginTop: 14,
                  padding: '20px 24px',
                }}
              >
                <Text
                  style={{
                    color: BRAND_GREEN,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  Qué puedes hacer
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
                  <span style={{ color: BRAND_GREEN, fontWeight: 700 }}>✓</span> Crea tu organización y reúne a tu
                  comunidad
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  <span style={{ color: BRAND_GREEN, fontWeight: 700 }}>✓</span> Sigue a las organizaciones que te
                  interesen para no perderte nada
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  <span style={{ color: BRAND_GREEN, fontWeight: 700 }}>✓</span> Publica eventos y meetups, presenciales
                  u online
                </Text>
                <Text style={{ color: TEXT_BODY, fontSize: 14, lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  <span style={{ color: BRAND_GREEN, fontWeight: 700 }}>✓</span> Apúntate a los que te interesen y llena
                  tu calendario
                </Text>
              </Section>

              <Section className="text-center" style={{ marginTop: 36 }}>
                <Button
                  href={eventosWikiUrl}
                  className="rounded-full text-center"
                  style={{
                    backgroundColor: BRAND_GREEN,
                    color: BRAND_DARK,
                    fontSize: 15,
                    fontWeight: 700,
                    padding: '14px 40px',
                    textDecoration: 'none',
                  }}
                >
                  Explorar eventos.wiki
                </Button>
              </Section>

              <Text className="text-center" style={{ fontSize: 14, marginTop: 18, marginBottom: 0 }}>
                <Link
                  href={sirviendoCodigoUrl}
                  style={{ color: BRAND_GREEN, fontWeight: 600, textDecoration: 'underline' }}
                >
                  Conocer la comunidad Sirviendo Código →
                </Link>
              </Text>

              <Hr style={{ borderColor: BORDER_SOFT, marginTop: 32 }} />

              <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.65, marginTop: 24, marginBottom: 0 }}>
                Gracias por acompañar el proyecto hasta aquí. La mejor manera de celebrar esta nueva etapa es llenando
                el calendario de buenos eventos. Nos vemos por allí.
              </Text>

              <Row style={{ marginTop: 24 }}>
                <Column style={{ verticalAlign: 'middle', width: 64 }}>
                  <Img
                    src="https://eventos.wiki/alberto-chamorro.jpg"
                    alt="Alberto Chamorro"
                    width={64}
                    height={64}
                    style={{ borderRadius: 9999, display: 'block' }}
                  />
                </Column>
                <Column style={{ paddingLeft: 14, verticalAlign: 'middle' }}>
                  <Text style={{ color: TEXT_BODY, fontSize: 16, lineHeight: 1.4, margin: 0 }}>Un abrazo,</Text>
                  <Text style={{ color: BRAND_DARK, fontSize: 16, fontWeight: 700, margin: 0 }}>Alberto Chamorro</Text>
                  <Text style={{ fontSize: 13, margin: 0, marginTop: 2 }}>
                    <Link href={twitterUrl} style={{ color: BRAND_GREEN, fontWeight: 600, textDecoration: 'none' }}>
                      @achamorro_dev ↗
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>

          <Section style={{ backgroundColor: FOOTER_BG, borderTop: `1px solid ${BORDER_SOFT}`, padding: '32px 20px' }}>
            <Img
              src="https://eventos.wiki/logo.png"
              alt="eventos.wiki by sirviendo.código"
              width={170}
              style={{ height: 'auto', margin: '0 auto' }}
            />
            <Text
              className="text-center"
              style={{ color: TEXT_MUTED, fontSize: 12, lineHeight: 1.6, margin: '16px auto 4px', maxWidth: 480 }}
            >
              Este es un correo automático, por favor no respondas a este mensaje.
            </Text>
            <Text
              className="text-center"
              style={{ color: TEXT_MUTED, fontSize: 12, lineHeight: 1.6, margin: '4px auto', maxWidth: 480 }}
            >
              Puedes modificar tus ajustes de notificaciones en{' '}
              <Link href={notificationsUrl} style={{ color: BRAND_GREEN, textDecoration: 'underline' }}>
                configuración de notificaciones
              </Link>
              .
            </Text>
            <Text
              className="text-center"
              style={{ color: TEXT_MUTED, fontSize: 12, lineHeight: 1.6, margin: '4px auto 0', maxWidth: 480 }}
            >
              © 2026 eventos.wiki · Un proyecto de la comunidad Sirviendo Código
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
