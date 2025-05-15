import { actions } from 'astro:actions'
import Compressor from 'compressorjs'
import { useState } from 'react'
import { toast } from 'sonner'

interface UseUploadFileOptions {
  maxWidth?: number
  mimeType?: string
  quality?: number
}

export const useUploadFile = (options?: UseUploadFileOptions) => {
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<URL | null>(null)

  const onInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsLoading(true)
    new Compressor(file, {
      quality: options?.quality ?? 0.8,
      mimeType: options?.mimeType ?? 'image/webp',
      maxWidth: options?.maxWidth ?? 120,
      success: async compressedFile => {
        const formData = new FormData()
        formData.append('file', compressedFile, file.name)

        const { error, data } = await actions.files.uploadFileAction(formData)

        if (error || !data) {
          toast.error(error?.message ?? 'Error al subir la imagen')
          return
        }

        setImage(data.url)
        setIsLoading(false)
      },
      error: () => {
        setIsLoading(false)
        toast.error('Error al subir la imagen')
      },
    })
  }

  return {
    onInputFile,
    isLoading,
    image,
  }
}
