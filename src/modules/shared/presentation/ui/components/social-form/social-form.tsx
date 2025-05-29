import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import {
  Discord,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Telegram,
  Tiktok,
  Twitch,
  Whatsapp,
  XLogo,
  Youtube,
} from '@/ui/icons'
import { Input } from '@/ui/input'
import type { Control, FieldValues, Path } from 'react-hook-form'

type Social = {
  web?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  discord?: string
  telegram?: string
  whatsapp?: string
  tiktok?: string
  twitch?: string
  github?: string
  linkedin?: string
}

const socialFields: Record<keyof Social, { label: string; icon: React.ReactNode; placeholder: string }> = {
  web: {
    label: 'Web',
    icon: <Globe className="h-4 w-4" />,
    placeholder: 'https://www.acme.com',
  },
  twitter: {
    label: 'X / Twitter',
    icon: <XLogo className="h-4 w-4" />,
    placeholder: 'https://x.com/usuario',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />,
    placeholder: 'https://linkedin.com/in/usuario',
  },
  youtube: {
    label: 'YouTube',
    icon: <Youtube className="h-4 w-4" />,
    placeholder: 'https://youtube.com/@canal',
  },
  twitch: {
    label: 'Twitch',
    icon: <Twitch className="h-4 w-4" />,
    placeholder: 'https://twitch.tv/usuario',
  },
  facebook: {
    label: 'Facebook',
    icon: <Facebook className="h-4 w-4" />,
    placeholder: 'https://facebook.com/pagina',
  },
  instagram: {
    label: 'Instagram',
    icon: <Instagram className="h-4 w-4" />,
    placeholder: 'https://instagram.com/usuario',
  },
  github: {
    label: 'GitHub',
    icon: <Github className="h-4 w-4" />,
    placeholder: 'https://github.com/usuario',
  },
  telegram: {
    label: 'Telegram',
    icon: <Telegram className="h-4 w-4" />,
    placeholder: 'https://t.me/usuario',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: <Whatsapp className="h-4 w-4" />,
    placeholder: 'https://wa.me/usuario',
  },
  discord: {
    label: 'Discord',
    icon: <Discord className="h-4 w-4" />,
    placeholder: 'https://discord.gg/invite',
  },
  tiktok: {
    label: 'TikTok',
    icon: <Tiktok className="h-4 w-4" />,
    placeholder: 'https://tiktok.com/@usuario',
  },
}

interface Props<T extends FieldValues> {
  control: Control<T>
}

export const SocialForm = <T extends Social & FieldValues>({ control }: Props<T>) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Links</h3>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Object.entries(socialFields).map(([socialKey, { label, icon, placeholder }]) => (
          <div className="grid gap-2">
            <FormField
              control={control}
              name={socialKey as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={socialKey} className="flex items-center gap-1">
                    {icon} {label}
                  </FormLabel>
                  <FormControl>
                    <Input id={socialKey} placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
