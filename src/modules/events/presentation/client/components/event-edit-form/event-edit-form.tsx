'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { EventPrimitives } from '@/events/domain/event'
import { EventTypes } from '@/events/domain/event-type'
import { EventTypeSelect } from '@/events/presentation/client/components/event-type-select/event-type-select'
import { TicketForm } from '@/events/presentation/client/components/ticket-form/ticket-form'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import { useUploadImageForEditor } from '@/files/presentation/client/hooks/use-upload-image-for-editor'
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Camera, CameraSlash, Loader, X } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Switch } from '@/ui/switch'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'
import { AgendaForm } from '../agenda-form/agenda-form'
import { type EventFormSchema, eventFormSchema } from './event-form-schema'

interface Props {
  provinces: Province[]
  event?: EventPrimitives
  organizationId: string
  organization?: Primitives<Organization>
  tab?: 'info' | 'sponsors' | 'speakers' | 'agenda'
}

export const EventEditForm = ({ provinces, organizationId, event, organization, tab = 'info' }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { onInputFile, isLoading, image } = useUploadFile({ maxWidth: 1920 })
  const uploadImageForEditor = useUploadImageForEditor({ maxWidth: 1920 })
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<EventFormSchema>({
    defaultValues: {
      title: event?.title,
      slug: event?.slug,
      shortDescription: event?.shortDescription,
      content: event?.content,
      startsAt: event?.startsAt ? Datetime.toDate(event?.startsAt) : undefined,
      endsAt: event?.endsAt ? Datetime.toDate(event?.endsAt) : undefined,
      image: event?.image,
      type: event?.type ?? EventTypes.InPerson,
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
      streamingUrl: event?.streamingUrl,
      place: event?.place
        ? {
            id: event?.place.id,
            name: event?.place.name,
            address: event?.place.address,
          }
        : undefined,
      tickets: (event?.tickets as any) || [],
      tags: event?.tags ?? [],
      tagColor: event?.tagColor ?? '',
      callForSponsorsEnabled: event?.callForSponsorsEnabled ?? false,
      callForSponsorsContent: event?.callForSponsorsContent ?? '',
      callForSpeakersEnabled: event?.callForSpeakersEnabled ?? false,
      callForSpeakersStartsAt: event?.callForSpeakersStartsAt
        ? Datetime.toDate(event.callForSpeakersStartsAt)
        : undefined,
      callForSpeakersEndsAt: event?.callForSpeakersEndsAt ? Datetime.toDate(event.callForSpeakersEndsAt) : undefined,
      callForSpeakersContent: event?.callForSpeakersContent ?? '',
      agenda: event?.agenda ? (event.agenda as any) : undefined,
    },
    resolver: zodResolver(eventFormSchema),
  })

  const title = form.watch('title')
  const startsAt = form.watch('startsAt')
  const type = form.watch('type')

  useEffect(() => {
    if (title && startsAt) {
      const year = startsAt.getFullYear()
      form.setValue('slug', `${year}/${new SlugGenerator(title).generate()}`)
    }
  }, [title, startsAt, form.setValue])

  useEffect(() => {
    emptyLocationAndPlace()
    emptyStreamingUrl()

    function emptyLocationAndPlace() {
      if (type === EventTypes.Online) {
        form.setValue('location', undefined)
        form.setValue('place', undefined)
      }
    }

    function emptyStreamingUrl() {
      if (type === EventTypes.InPerson) {
        form.setValue('streamingUrl', undefined)
      }
    }
  }, [type, form.setValue])

  const onSubmit = async (values: EventFormSchema) => {
    const eventValues = {
      ...values,
      startsAt: values.startsAt.toISOString(),
      endsAt: values.endsAt.toISOString(),
      callForSpeakersStartsAt: values.callForSpeakersStartsAt?.toISOString(),
      callForSpeakersEndsAt: values.callForSpeakersEndsAt?.toISOString(),
      agenda: values.agenda
        ? {
            ...values.agenda,
            tracks: values.agenda.tracks?.map(track => ({
              ...track,
              sessions: track.sessions?.map(session => ({
                ...session,
                startsAt: session.startsAt.toISOString(),
                endsAt: session.endsAt.toISOString(),
              })),
            })),
            commonElements: values.agenda.commonElements?.map(element => ({
              ...element,
              startsAt: element.startsAt.toISOString(),
              endsAt: element.endsAt.toISOString(),
            })),
          }
        : undefined,
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
            <div className="flex w-full flex-col items-center gap-2 lg:max-w-1/3">
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
                        aria-invalid={!!form.formState.errors.image}
                        className={
                          'flex w-full items-center justify-center rounded-md border-2 border-input bg-input aria-invalid:border-destructive'
                        }
                      >
                        <CameraSlash className="h-72 w-48 text-gray-400" />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      type="button"
                      size="icon"
                      className="-mt-7 z-1 ml-4"
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

            {/* Columna derecha: Contenido según tab activa */}
            <div className="w-full flex-1 space-y-6">
              {tab === 'info' && (
                <>
                  {/* Sección: Información básica */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-xl">Información básica</h2>
                    <FormField
                      control={form.control}
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
                              <p className="font-medium text-destructive text-xs">{slugError.message}</p>
                            )}
                          </FormItem>
                        )
                      }}
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                  {/* Sección: Tipo y localización */}
                  <div className="border-t pt-6">
                    <h2 className="mb-4 font-semibold text-xl">Tipo y localización</h2>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="type">Tipo de evento</FormLabel>
                            <FormControl>
                              <EventTypeSelect
                                id="type"
                                placeholder="Selecciona un tipo"
                                value={field.value}
                                onChange={field.onChange}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {(type === EventTypes.InPerson || type === EventTypes.Hybrid) && (
                        <>
                          <FormField
                            control={form.control}
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
                            control={form.control}
                            name="place"
                            render={({ field }) => (
                              <>
                                <FormItem>
                                  <FormLabel htmlFor="placeDisplayName">Dirección</FormLabel>
                                  <FormControl>
                                    <PlaceSearch
                                      className="w-full"
                                      value={field.value}
                                      onPlaceSelect={(place: Primitives<Place>) => {
                                        form.setValue('place', place)
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                                {field.value && <PlaceEmbedMap place={field.value} height="200px" />}
                              </>
                            )}
                          />
                        </>
                      )}

                      {(type === EventTypes.Online || type === EventTypes.Hybrid) && (
                        <FormField
                          control={form.control}
                          name="streamingUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="streamingUrl">URL del streaming</FormLabel>
                              <FormControl>
                                <Input
                                  id="streamingUrl"
                                  placeholder="https://..."
                                  type="url"
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

                  {/* Sección: Categorías */}
                  <div className="border-t pt-6">
                    <h2 className="mb-4 font-semibold text-xl">Categorías</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="tags"
                          render={() => (
                            <FormItem>
                              <FormLabel>Etiquetas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Escribe y presiona Enter para agregar etiquetas"
                                  onKeyDown={onAddTag}
                                />
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
                                <ColorPicker
                                  color={field.value || ''}
                                  onChange={color => form.setValue('tagColor', color)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch('tags')?.map((tag, index) => (
                          <Badge key={tag} className="text-white" style={{ backgroundColor: form.watch('tagColor') }}>
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
                    <h2 className="mb-4 font-semibold text-xl">Redes sociales y enlaces</h2>
                    <SocialForm control={form.control} />
                  </div>

                  {/* Sección: Tipos de entrada */}
                  <div className="border-t pt-6">
                    <TicketForm />
                  </div>
                </>
              )}

              {/* Sección: Call for Sponsors (solo en pestaña sponsors) */}
              {tab === 'sponsors' && (
                <div className="border-t pt-6">
                  <h2 className="mb-4 font-semibold text-xl">Call for Sponsors</h2>
                  <p className="mb-4 text-gray-500 text-sm">
                    Opcional - Activa y configura el período para conseguir sponsors
                  </p>

                  <FormField
                    control={form.control}
                    name="callForSponsorsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Activar Call for Sponsors</FormLabel>
                          <FormDescription>Habilita una pestaña para mostrar información de patrocinio</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('callForSponsorsEnabled') && (
                    <FormField
                      control={form.control}
                      name="callForSponsorsContent"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Contenido de Call for Sponsors</FormLabel>
                          <FormControl>
                            <RichEditor
                              content={field.value ?? ''}
                              onContentChange={field.onChange}
                              onUploadImage={uploadImageForEditor}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* Sección: Call for Speakers (solo en pestaña speakers) */}
              {tab === 'speakers' && (
                <div className="border-t pt-6">
                  <h2 className="mb-4 font-semibold text-xl">Call for Speakers</h2>
                  <p className="mb-4 text-gray-500 text-sm">
                    Opcional - Activa y configura el período para conseguir speakers
                  </p>

                  <FormField
                    control={form.control}
                    name="callForSpeakersEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Activar Call for Speakers</FormLabel>
                          <FormDescription>Habilita una pestaña para recibir propuestas de charlas</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch('callForSpeakersEnabled') && (
                    <>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="callForSpeakersStartsAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de inicio</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  disabled={form.formState.isSubmitting}
                                  placeholder="Elige una fecha"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="callForSpeakersEndsAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de fin</FormLabel>
                              <FormControl>
                                <DateTimePicker
                                  disabled={form.formState.isSubmitting}
                                  placeholder="Elige una fecha"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="callForSpeakersContent"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Contenido de Call for Speakers</FormLabel>
                            <FormControl>
                              <RichEditor
                                content={field.value ?? ''}
                                onContentChange={field.onChange}
                                onUploadImage={uploadImageForEditor}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              )}

              {/* Sección: Agenda (solo en pestaña agenda) */}
              {tab === 'agenda' && (
                <div className="border-t pt-6">
                  <h2 className="mb-4 font-semibold text-xl">Agenda del evento</h2>
                  <p className="mb-4 text-gray-500 text-sm">
                    Opcional - Configura la agenda con tracks, sesiones y speakers
                  </p>

                  <div className="mt-4">
                    <AgendaForm />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Sección: Detalles del evento (solo en pestaña info) */}
          {tab === 'info' && (
            <div className="border-t pt-6">
              <h2 className="mb-4 font-semibold text-xl">Detalles del evento</h2>
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
          )}
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
