'use client'

import type { Event } from '@/events/domain/event'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import { useUploadImageForEditor } from '@/files/presentation/client/hooks/use-upload-image-for-editor'
import type { Organization } from '@/organizations/domain/organization'
import type { Province } from '@/provinces/domain/province'
import { ProvinceCollection } from '@/provinces/domain/province-collection'
import { ProvinceSelect } from '@/provinces/presentation/server/components/province-combobox/province-select'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { ColorPicker } from '@/ui/color-picker'
import { DateTimePicker } from '@/ui/components/date-time-picker'
import { RichEditor } from '@/ui/components/rich-editor/rich-editor'
import { SocialForm } from '@/ui/components/social-form/social-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Camera, CameraSlash, Loader, X } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'
import { zodResolver } from '@hookform/resolvers/zod'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { eventFormSchema, type EventFormSchema } from './event-form-schema'

interface Props {
  provinces: Province[]
  event?: Primitives<Event>
  organizationId: string
  organization?: Primitives<Organization>
}

export const EventEditForm = ({ provinces, organizationId, event, organization }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { onInputFile, isLoading, image } = useUploadFile({ maxWidth: 1920 })
  const uploadImageForEditor = useUploadImageForEditor({ maxWidth: 1920 })
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<EventFormSchema>({
    defaultValues: {
      title: event?.title ?? '',
      slug: event?.slug ?? '',
      shortDescription: event?.shortDescription ?? '',
      content: event?.content ?? '',
      startsAt: event?.startsAt ? Datetime.toDate(event?.startsAt) : undefined,
      endsAt: event?.endsAt ? Datetime.toDate(event?.endsAt) : undefined,
      image: event?.image,
      location: new ProvinceCollection(provinces).slugWithName(event?.location ?? undefined),
      web: event?.web,
      twitter: event?.twitter || organization?.twitter,
      linkedin: event?.linkedin || organization?.linkedin,
      twitch: event?.twitch || organization?.twitch,
      github: event?.github || organization?.github,
      facebook: event?.facebook || organization?.facebook,
      instagram: event?.instagram || organization?.instagram,
      youtube: event?.youtube || organization?.youtube,
      discord: event?.discord || organization?.discord,
      telegram: event?.telegram || organization?.telegram,
      whatsapp: event?.whatsapp || organization?.whatsapp,
      tiktok: event?.tiktok,
      tags: event?.tags ?? [],
      tagColor: event?.tagColor ?? '',
    },
    resolver: zodResolver(eventFormSchema),
  })

  const title = form.watch('title')
  const startsAt = form.watch('startsAt')

  useEffect(() => {
    if (title && startsAt) {
      const year = startsAt.getFullYear()
      form.setValue('slug', `${year}/${slugify(title, { lower: true, remove: /[:,#]/g })}`)
    }
  }, [title, startsAt])

  const onSubmit = async (values: EventFormSchema) => {
    const eventValues = {
      ...values,
      startsAt: values.startsAt.toISOString(),
      endsAt: values.endsAt.toISOString(),
      organizationId,
      eventId: event?.id,
    }

    setIsSaving(true)
    const { error } = await actions.events.saveEventAction(eventValues)
    setIsSaving(false)

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

  const onAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const input = e.currentTarget
      const value = input.value.trim()

      if (value) {
        const tags = form.getValues('tags') ?? []
        const newTags = value.split(',')
        form.setValue('tags', tags.concat(newTags))
        input.value = ''
      }
    }
  }

  const onRemoveTag = (index: number) => {
    const tags = form.getValues('tags') ?? []
    const newTags = tags.toSpliced(index, 1)
    form.setValue('tags', newTags)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} id="event-edit-form" className="container mx-auto">
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
              <div className="lg:max-w-1/3 flex w-full flex-col items-center gap-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <>
                      {field.value ? (
                        <img
                          src={field.value}
                          alt={form.watch('title')}
                          className="h-72 rounded-md border-transparent object-cover"
                        />
                      ) : (
                        <div
                          aria-invalid={!!form.formState.errors['image']}
                          className={
                            'aria-invalid:border-destructive border-input bg-input flex w-full items-center justify-center rounded-md border-2'
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
                      <input type="file" id="image" ref={fileInputRef} className="hidden" onChange={onInputFile} />
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
                          Localización
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

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Etiquetas</FormLabel>
                        <FormControl>
                          <Input placeholder="Escribe y presiona Enter para agregar etiquetas" onKeyDown={onAddTag} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color de la etiqueta</FormLabel>
                        <FormControl>
                          <ColorPicker color={field.value || ''} onChange={color => form.setValue('tagColor', color)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-2">
                    {form.watch('tags')?.map((tag, index) => (
                      <Badge key={index} className="text-white" style={{ backgroundColor: form.watch('tagColor') }}>
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:cursor-pointer hover:bg-transparent"
                          onClick={() => onRemoveTag(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Eliminar etiqueta</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <SocialForm control={form.control} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Detalles del evento</h3>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichEditor
                      content={field.value}
                      onContentChange={field.onChange}
                      onUploadImage={uploadImageForEditor}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex w-full justify-end">
          <Button type="submit" className="w-full md:w-min" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader className="animate-spin" /> Guardando
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
