'use client'

import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'astro/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
import { toast } from 'sonner'
import { useUploadFile } from '@/files/presentation/client/hooks/use-upload-file'
import type { Organization } from '@/organizations/domain/organization'
import type { Province } from '@/provinces/domain/province'
import { ProvinceCollection } from '@/provinces/domain/province-collection'
import { ProvinceSelect } from '@/provinces/presentation/server/components/province-combobox/province-select'
import type { Primitives } from '@/shared/domain/primitives/primitives'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/components/button'
import { SocialForm } from '@/ui/components/social-form/social-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Camera, Loader, MapPin } from '@/ui/icons'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Urls } from '@/ui/urls/urls'
import { organizationFormSchema } from './organization-form-schema'

interface Props {
  provinces: Province[]
  organization?: Primitives<Organization>
  organizerId: string
}

export const OrganizationEditForm = ({ provinces, organizerId, organization }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { onInputFile, isLoading, image } = useUploadFile()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof organizationFormSchema>>({
    defaultValues: {
      name: organization?.name,
      image: organization?.image ?? 'https://github.com/shadcn.png',
      bio: organization?.bio,
      handle: organization?.handle,
      location: new ProvinceCollection(provinces).slugWithName(organization?.location ?? undefined),
      web: organization?.web,
      twitter: organization?.twitter,
      facebook: organization?.facebook,
      instagram: organization?.instagram,
      youtube: organization?.youtube,
      discord: organization?.discord,
      telegram: organization?.telegram,
      whatsapp: organization?.whatsapp,
      tiktok: organization?.tiktok,
    },
    // @ts-expect-error - Type instantiation is excessively deep due to complex Zod schema inference
    resolver: zodResolver(organizationFormSchema),
  })

  const name = form.watch('name')

  useEffect(() => {
    form.setValue('handle', slugify(name, { lower: true }))
  }, [name])

  const onSubmit = async (values: z.infer<typeof organizationFormSchema>) => {
    const organizationValues = {
      ...values,
      organizerId,
      organizationId: organization?.id,
    }

    setIsSaving(true)
    const { error } = await actions.organizations.saveOrganizationAction(organizationValues)
    setIsSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }

    navigate(Urls.ORGANIZATION(values.handle))
  }

  const onError = () => {
    toast.error('El formulario contiene errores, por favor, revisa los campos.')
  }

  useEffect(() => {
    if (image) {
      form.setValue('image', image.toString())
    }
  }, [image, form.setValue])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} id="organization-edit-form" className="container mx-auto">
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.watch('image')} alt="Avatar" />
                  <AvatarFallback>{form.watch('name').slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  type="button"
                  size="icon"
                  className="z-1 -mt-8 ml-12"
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
                <input type="file" id="image" ref={fileInputRef} className="hidden" onChange={onInputFile} />
              </div>

              <div className="flex w-full flex-1 flex-col items-center justify-between gap-2 space-y-4 lg:flex-row lg:space-y-0">
                <div className="grid w-full flex-1 gap-2">
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

                <div className="grid w-full flex-1 gap-2">
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
          </div>

          <SocialForm control={form.control} />
        </div>
        <div className="mt-4 flex w-full justify-end">
          <Button type="submit" className="w-full md:w-min" disabled={isSaving}>
            {isSaving && (
              <>
                <Loader className="animate-spin" /> Guardando
              </>
            )}
            {!isSaving && 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
