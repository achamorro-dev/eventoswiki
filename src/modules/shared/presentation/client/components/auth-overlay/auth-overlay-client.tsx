'use client'

import { Link } from '@/modules/shared/presentation/ui/components/link'
import { AnalyticsEvents } from '@/shared/domain/analytics/analytics-events'
import { useAnalytics } from '@/shared/presentation/client/hooks/use-analytics'
import { Urls } from '@/ui/urls/urls'

interface SocialLinkProps {
  provider: 'google' | 'github' | 'twitter'
  href: string
  children: React.ReactNode
}

const SocialLink = ({ provider, href, children }: SocialLinkProps) => {
  const { trackEvent } = useAnalytics()

  const handleClick = () => {
    trackEvent(AnalyticsEvents.authOverlayLogin, { provider })
  }

  const icons = {
    google: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" role="img">
        <path
          fill="#4285F4"
          d="M17.64 9.20419C17.64 8.56601 17.5827 7.95237 17.4764 7.36328H9V10.8446H13.8436C13.635 11.9696 13.0009 12.9228 12.0477 13.561V15.8192H14.9564C16.6582 14.2524 17.64 11.9451 17.64 9.20419Z"
        />
        <path
          fill="#34A853"
          d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40664 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z"
        />
        <path
          fill="#EA4335"
          d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z"
        />
      </svg>
    ),
    github: (
      <svg height="24" viewBox="0 0 24 24" width="24" aria-hidden="true" role="img" className="h-6 w-6">
        <path
          fill="currentColor"
          d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"
        />
      </svg>
    ),
    twitter: (
      <svg height="24" viewBox="0 0 24 24" width="24" aria-hidden="true" role="img" className="h-6 w-6">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    ),
  }

  return (
    <Link
      href={href}
      variant="outline"
      className="flex-1 items-center justify-center gap-2"
      data-astro-prefetch="false"
      onClick={handleClick}
    >
      {icons[provider]}
      {children}
    </Link>
  )
}

interface AuthOverlayProps {
  redirectUrl?: string
  message?: string
}

export const AuthOverlayClient = ({ redirectUrl, message }: AuthOverlayProps) => {
  const getNextParam = () => (redirectUrl ? `?_next=${encodeURIComponent(redirectUrl)}` : '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-4">
        <article className="flex flex-col gap-6 rounded-xl bg-card p-6 text-card-foreground">
          <section className="flex flex-col items-center justify-center gap-8">
            <img src="/icon.png" alt="Logo" width="180" height="180" className="h-16 w-16" />
            <h2 className="text-center text-xl font-semibold">{message}</h2>
            <nav className="flex w-full flex-col items-stretch justify-center gap-4">
              <SocialLink provider="google" href={`${Urls.LOGIN_GOOGLE}${getNextParam()}`}>
                Continuar con Google
              </SocialLink>
              <SocialLink provider="github" href={`${Urls.LOGIN_GITHUB}${getNextParam()}`}>
                Continuar con GitHub
              </SocialLink>
              <SocialLink provider="twitter" href={`${Urls.LOGIN_TWITTER}${getNextParam()}`}>
                Continuar con X
              </SocialLink>
            </nav>
            <p className="text-sm text-muted-foreground">
              Al continuar, aceptas las{' '}
              <a href={Urls.TERMS} target="_blank" rel="noopener noreferrer" className="underline">
                Condiciones de uso
              </a>{' '}
              y la{' '}
              <a href={Urls.PRIVACY} target="_blank" rel="noopener noreferrer" className="underline">
                Política de privacidad
              </a>{' '}
              de Eventos.wiki.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
