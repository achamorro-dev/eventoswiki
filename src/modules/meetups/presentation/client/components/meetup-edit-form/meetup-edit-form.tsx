'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import { useUploadImageForEditor } from '@/files/presentation/client/hooks/use-upload-image-for-editor'
import type { Meetup } from '@/meetups/domain/meetup'
import { MeetupTypes } from '@/meetups/domain/meetup-type'
import type { Place } from '@/modules/places/domain/place'
import { PlaceEmbedMap } from '@/modules/places/presentation/client/components/place-embed-map/place-embed-map'
import { PlaceSearch } from '@/modules/places/presentation/client/components/place-search'
import type { Organization } from '@/organizations/domain/organization'
import type { Province } from '@/provinces/domain/province'
import { ProvinceCollection } from '@/provinces/domain/province-collection'
import { ProvinceSelect } from '@/provinces/presentation/server/components/province-combobox/province-select'
import { Datetime } from '@/shared/domain/datetime/datetime'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { SlugGenerator } from '@/shared/presentation/services/slugs/slug-generator'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { ColorPicker } from '@/ui/color-picker'
import { DateTimePicker } from '@/ui/components/date-time-picker'
import { RichEditor } from '@/ui/components/rich-editor/rich-editor'
import { SocialForm } from '@/ui/components/social-form/social-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Camera, CameraSlash, Loader, X } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Switch } from '@/ui/switch'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'
import { MeetupTypeSelect } from '../meetup-type-select/meetup-type-select'
import { type MeetupFormSchema, meetupFormSchema } from './meetup-form-schema'

interface Props {
  provinces: Province[]
  meetup?: Primitives<Meetup>
  organizationId: string
  organization?: Primitives<Organization>
}

export const MeetupEditForm = ({ provinces, organizationId, meetup, organization }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { onInputFile, isLoading, image } = useUploadFile({ maxWidth: 1920 })
  const uploadImageForEditor = useUploadImageForEditor({ maxWidth: 1920 })
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<MeetupFormSchema>({
    defaultValues: {
      title: meetup?.title,
      slug: meetup?.slug,
      shortDescription: meetup?.shortDescription,
      content: meetup?.content,
      startsAt: meetup?.startsAt ? Datetime.toDate(meetup?.startsAt) : undefined,
      endsAt: meetup?.endsAt ? Datetime.toDate(meetup?.endsAt) : undefined,
      image: meetup?.image,
      type: meetup?.type ?? MeetupTypes.InPerson,
      location: new ProvinceCollection(provinces).slugWithName(meetup?.location ?? undefined),
      web: meetup?.web,
      twitter: meetup?.twitter || organization?.twitter,
      linkedin: meetup?.linkedin || organization?.linkedin,
      twitch: meetup?.twitch || organization?.twitch,
      github: meetup?.github || organization?.github,
      facebook: meetup?.facebook || organization?.facebook,
      instagram: meetup?.instagram || organization?.instagram,
      youtube: meetup?.youtube || organization?.youtube,
      discord: meetup?.discord || organization?.discord,
      telegram: meetup?.telegram || organization?.telegram,
      whatsapp: meetup?.whatsapp || organization?.whatsapp,
      tiktok: meetup?.tiktok || organization?.tiktok,
      streamingUrl: meetup?.streamingUrl,
      place: meetup?.place
        ? {
            id: meetup?.place.id,
            name: meetup?.place.name,
            address: meetup?.place.address,
          }
        : undefined,
      tags: meetup?.tags ?? [],
      tagColor: meetup?.tagColor ?? '',
      allowsAttendees: meetup?.allowsAttendees ?? true,
      registrationEndsAt: meetup?.registrationEndsAt ? Datetime.toDate(meetup.registrationEndsAt) : undefined,
      maxAttendees: meetup?.maxAttendees,
    },
    resolver: zodResolver(meetupFormSchema),
  })

  const control = form.control as Control<MeetupFormSchema>

  const title = form.watch('title')
  const startsAt = form.watch('startsAt')
  const type = form.watch('type')

  useEffect(() => {
    updateSlug()

    function updateSlug() {
      if (title && startsAt) {
        const year = startsAt.getFullYear()
        form.setValue('slug', `${year}/${new SlugGenerator(title).generate()}`)
      }
    }
  }, [title, startsAt, form.setValue])

  useEffect(() => {
    emptyLocationAndPlace()
    emptyStreamingUrl()

    function emptyLocationAndPlace() {
      if (type === MeetupTypes.Online) {
        form.setValue('location', undefined)
        form.setValue('place', undefined)
      }
    }

    function emptyStreamingUrl() {
      if (type === MeetupTypes.InPerson) {
        form.setValue('streamingUrl', undefined)
      }
    }
  }, [type, form.setValue])

  const onSubmit = async (values: MeetupFormSchema) => {
    const meetupValues = {
      ...values,
      startsAt: values.startsAt.toISOString(),
      endsAt: values.endsAt.toISOString(),
      organizationId,
      meetupId: meetup?.id,
    }

    setIsSaving(true)
    const { error } = await actions.meetups.saveMeetupAction(meetupValues)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    navigate(Urls.MEETUP(values.slug))
  }

  const onError = () => {
    toast.error('El formulario contiene errores, por favor, revisa los campos.')
  }

  useEffect(() => {
    if (image) {
      form.setValue('image', image.toString())
    }
  }, [image, form.setValue])

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
          <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
            {/* Columna izquierda: Imagen */}
            <div className="lg:max-w-1/3 flex w-full flex-col items-center gap-2">
              <FormField
                control={control}
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

            {/* Columna derecha: Todas las secciones excepto Detalles del evento */}
            <div className="w-full flex-1 space-y-6">
              {/* Sección: Información básica */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Información básica</h2>
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => {
                    const slugError = form.formState.errors.slug
                    return (
                    <FormItem>
                      <FormLabel htmlFor="title">Título</FormLabel>
                      <FormControl>
                        <Input id="title" placeholder="Título del evento" {...field} />
                      </FormControl>
                      <FormMessage />
                      {slugError && !form.formState.errors.title && (
                        <p className="text-destructive text-xs font-medium">{slugError.message}</p>
                      )}
                    </FormItem>
                  )}}
                />
                <FormField
                  control={control}
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
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
                    control={control}
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

              {/* Sección: Tipo y localización */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Tipo y localización</h2>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="type">Tipo de meetup</FormLabel>
                        <FormControl>
                          <MeetupTypeSelect id="type" placeholder="Tipo de meetup" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(type === MeetupTypes.InPerson || type === MeetupTypes.Hybrid) && (
                    <>
                      <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="location">Provincia</FormLabel>
                            <FormControl>
                              <ProvinceSelect
                                id="location"
                                placeholder="Selecciona una provincia"
                                provinces={provinces}
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="place"
                        render={({ field }) => (
                          <>
                            <FormItem>
                              <FormLabel htmlFor="placeDisplayName">Dirección</FormLabel>
                              <FormControl>
                                <PlaceSearch
                                  className="w-full"
                                  value={field.value as Primitives<Place> | undefined}
                                  onPlaceSelect={(place: Primitives<Place>) => {
                                    form.setValue('place', place)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            {field.value && <PlaceEmbedMap place={field.value as Primitives<Place> | undefined} height="200px" />}
                          </>
                        )}
                      />
                    </>
                  )}

                  {(type === MeetupTypes.Online || type === MeetupTypes.Hybrid) && (
                    <FormField
                      control={control}
                      name="streamingUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="streamingUrl">URL del streaming</FormLabel>
                          <FormControl>
                            <Input
                              id="streamingUrl"
                              type="url"
                              placeholder="https://..."
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Sección: Configuración de asistentes */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Configuración de asistentes</h2>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="allowsAttendees"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel htmlFor="allowsAttendees">Permitir registro de asistentes</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Los usuarios podrán registrarse como asistentes a este meetup
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            id="allowsAttendees"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch('allowsAttendees') && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={control}
                        name="registrationEndsAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="registrationEndsAt">Fecha límite de registro</FormLabel>
                            <p className="text-sm text-muted-foreground mb-2">
                              Los usuarios no podrán registrarse después de esta fecha
                            </p>
                            <FormControl>
                              <DateTimePicker
                                disabled={form.formState.isSubmitting}
                                placeholder="Elige una fecha (opcional)"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="maxAttendees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="maxAttendees">Aforo máximo</FormLabel>
                            <p className="text-sm text-muted-foreground mb-2">
                              Número máximo de asistentes permitidos
                            </p>
                            <FormControl>
                              <Input
                                id="maxAttendees"
                                type="number"
                                min="1"
                                placeholder="Ilimitado"
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === '' ? undefined : Number(value))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sección: Etiquetas y categorización */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Etiquetas y categorización</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={control}
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
                      control={control}
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
                  </div>
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
              </div>

              {/* Sección: Redes sociales */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Redes sociales y enlaces</h2>
                <SocialForm control={form.control} />
              </div>
            </div>
          </div>

          {/* Sección: Detalles del evento (ancho completo) */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Detalles del evento</h2>
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
