'use client'

import type { Event } from '@/events/domain/event'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import type { Province } from '@/provinces/domain/province'
import { ProvinceSelect } from '@/provinces/presentation/server/components/province-combobox/province-select'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Button } from '@/ui/button'
import { DateTimePicker } from '@/ui/components/date-time-picker'
import { RichEditor } from '@/ui/components/rich-editor/rich-editor'
import { SocialForm } from '@/ui/components/social-form/social-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Camera, CameraSlash, Loader, MapPin } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'astro/zod'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { eventFormSchema } from './event-form-schema'

interface Props {
  provinces: Province[]
  event?: Primitives<Event>
  organizationId: string
}

export const EventEditForm = ({ provinces, organizationId, event }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { onInputFile, isLoading, image } = useUploadFile({ maxWidth: 1920 })

  const form = useForm<z.infer<typeof eventFormSchema>>({
    defaultValues: {
      title: event?.title ?? '',
      slug: event?.slug ?? '',
      shortDescription: event?.shortDescription ?? '',
      content: event?.content ?? '',
      startsAt: event?.startsAt ? Datetime.toDate(event?.startsAt) : undefined,
      endsAt: event?.endsAt ? Datetime.toDate(event?.endsAt) : undefined,
      image: event?.image,
      location: event?.location ?? undefined,
      web: event?.web,
      twitter: event?.twitter,
      facebook: event?.facebook,
      instagram: event?.instagram,
      youtube: event?.youtube,
      discord: event?.discord,
      telegram: event?.telegram,
      whatsapp: event?.whatsapp,
      tiktok: event?.tiktok,
    },
    resolver: zodResolver(eventFormSchema),
  })

  const title = form.watch('title')
  const startsAt = form.watch('startsAt')

  useEffect(() => {
    if (title && startsAt) {
      const year = startsAt.getFullYear()
      form.setValue('slug', `${year}/${slugify(title, { lower: true })}`)
    }
  }, [title, startsAt])

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const eventValues = {
      title: values.title,
      slug: values.slug,
      shortDescription: values.shortDescription,
      content: values.content,
      startsAt: values.startsAt.toISOString(),
      endsAt: values.endsAt.toISOString(),
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
      organizationId,
      eventId: event?.id,
    }
    const { error } = await actions.events.saveEventAction(eventValues)

    if (error) {
      toast.error(error.message)
      return
    }

    navigate(Urls.EVENT(values.slug))
  }

  const onError = () => {
    toast.error('El formulario contiene errores, por favor, revisa los campos.')
  }

  useEffect(() => {
    if (image) {
      form.setValue('image', image.toString())
    }
  }, [image])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} id="organization-edit-form">
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
              <div className="lg:max-w-1/3 flex w-full flex-col items-center gap-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <>
                      {image ? (
                        <img
                          src={field.value}
                          alt={form.watch('title')}
                          className="h-72 rounded-md border-transparent object-cover"
                        />
                      ) : (
                        <div
                          aria-invalid={!!form.formState.errors['image']}
                          className={
                            'aria-invalid:border-destructive flex w-full items-center justify-center rounded-md border-2 border-gray-100 bg-gray-100'
                          }
                        >
                          <CameraSlash className="h-72 w-48 text-gray-400" />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        type="button"
                        size="icon"
                        className="z-1 -mt-7 ml-4"
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </Button>
                      <input type="file" id="image" ref={fileInputRef} className="hidden" onChange={field.onChange} />
                      <FormMessage />
                    </>
                  )}
                />
              </div>

              <div className="w-full flex-1 space-y-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="title">Título</FormLabel>
                        <FormControl>
                          <Input id="title" placeholder="Título del evento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="shortDescription">Descripción corta</FormLabel>
                        <FormControl>
                          <Textarea
                            id="shortDescription"
                            placeholder="Describe el evento..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startsAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="startsAt">Fecha de inicio</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              disabled={form.formState.isSubmitting}
                              placeholder="Elige una fecha"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endsAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="endsAt">Fecha de fin</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              value={field.value}
                              onChange={field.onChange}
                              disabled={form.formState.isSubmitting}
                              placeholder="Elige una fecha"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
            </div>
          </div>

          <SocialForm control={form.control} />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalles del evento</h3>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichEditor content={field.value} onContentChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
