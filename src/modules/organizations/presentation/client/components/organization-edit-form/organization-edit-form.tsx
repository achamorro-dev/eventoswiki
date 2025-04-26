'use client'

import type { Province } from '@/provinces/domain/province'
import { ProvinceSelect } from '@/provinces/presentation/server/components/province-combobox/province-select'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/components/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import {
  Camera,
  Discord,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  Telegram,
  Tiktok,
  Twitch,
  Whatsapp,
  XLogo,
  Youtube,
} from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { organizationFormSchema } from './organization-form-schema'

interface Props {
  provinces: Province[]
  organizerId: string
}

export const OrganizationEditForm = ({ provinces, organizerId }: Props) => {
  const form = useForm<z.infer<typeof organizationFormSchema>>({
    defaultValues: {
      name: '',
      image: 'https://github.com/shadcn.png',
    },
    resolver: zodResolver(organizationFormSchema),
  })

  const name = form.watch('name')

  useEffect(() => {
    form.setValue('handle', slugify(name, { lower: true }))
  }, [name])

  const onSubmit = async (values: z.infer<typeof organizationFormSchema>) => {
    const { error } = await actions.organization.createOrganizationAction({
      name: values.name,
      bio: values.bio,
      handle: values.handle,
      image: values.image,
      location: values.location,
      web: values.web,
      twitter: values.twitter,
      facebook: values.facebook,
      instagram: values.instagram,
      youtube: values.youtube,
      discord: values.discord,
      telegram: values.telegram,
      whatsapp: values.whatsapp,
      tiktok: values.tiktok,
      twitch: values.twitch,
      github: values.github,
      linkedin: values.linkedin,
      organizerId,
    })

    if (error) {
      toast.error(error.message)
    }

    // navigate(Urls.MY_ORGANIZATIONS)
  }

  const onError = () => {
    toast.error('El formulario contiene errores, por favor, revisa los campos.')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} id="organization-edit-form">
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.watch('image')} alt="Avatar" />
                  <AvatarFallback>ORG</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="z-1 -mt-8 ml-12">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Nombre (@{form.watch('handle')})</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="Nombre de la organización" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="bio">Biografía</FormLabel>
                    <FormControl>
                      <Textarea
                        id="bio"
                        placeholder="Describe tu organización de eventos..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="web"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="web" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Web
                    </FormLabel>
                    <FormControl>
                      <Input id="web" placeholder="https://www.tuorganizacion.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="location" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Localización
                    </FormLabel>
                    <FormControl>
                      <ProvinceSelect
                        id="location"
                        placeholder="Provincia"
                        provinces={provinces}
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Redes Sociales</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="twitter" className="flex items-center gap-1">
                        <XLogo className="h-4 w-4" /> Twitter / X
                      </FormLabel>
                      <FormControl>
                        <Input id="twitter" placeholder="https://twitter.com/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="linkedin" className="flex items-center gap-1">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </FormLabel>
                      <FormControl>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="youtube" className="flex items-center gap-1">
                        <Youtube className="h-4 w-4" /> YouTube
                      </FormLabel>
                      <FormControl>
                        <Input id="youtube" placeholder="https://youtube.com/@canal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="twitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="twitch" className="flex items-center gap-1">
                        <Twitch className="h-4 w-4" /> Twitch
                      </FormLabel>
                      <FormControl>
                        <Input id="twitch" placeholder="https://twitch.tv/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="facebook" className="flex items-center gap-1">
                        <Facebook className="h-4 w-4" /> Facebook
                      </FormLabel>
                      <FormControl>
                        <Input id="facebook" placeholder="https://facebook.com/pagina" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="instagram" className="flex items-center gap-1">
                        <Instagram className="h-4 w-4" /> Instagram
                      </FormLabel>
                      <FormControl>
                        <Input id="instagram" placeholder="https://instagram.com/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="github" className="flex items-center gap-1">
                        <Github className="h-4 w-4" /> GitHub
                      </FormLabel>
                      <FormControl>
                        <Input id="github" placeholder="https://github.com/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="telegram" className="flex items-center gap-1">
                        <Telegram className="h-4 w-4" /> Telegram
                      </FormLabel>
                      <FormControl>
                        <Input id="telegram" placeholder="https://t.me/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="whatsapp" className="flex items-center gap-1">
                        <Whatsapp className="h-4 w-4" /> WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input id="whatsapp" placeholder="https://wa.me/usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="discord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="discord" className="flex items-center gap-1">
                        <Discord className="h-4 w-4" /> Discord
                      </FormLabel>
                      <FormControl>
                        <Input id="discord" placeholder="https://discord.gg/invite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="tiktok" className="flex items-center gap-1">
                        <Tiktok className="h-4 w-4" /> TikTok
                      </FormLabel>
                      <FormControl>
                        <Input id="tiktok" placeholder="https://tiktok.com/@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <Button type="submit" className="w-full md:w-min">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}
