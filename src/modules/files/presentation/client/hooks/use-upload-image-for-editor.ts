import { actions } from 'astro:actions'
import Compressor from 'compressorjs'
import { toast } from 'sonner'

interface UseUploadImageForEditorOptions {
  maxWidth?: number
  mimeType?: string
  quality?: number
}

/**
 * Hook that returns a function to upload images for use in rich text editors.
 * The returned function compresses and uploads the image, returning the URL as a string.
 */
export const useUploadImageForEditor = (options?: UseUploadImageForEditorOptions) => {
  const uploadImage = async (file: File): Promise<string> => {
    // Validate mime type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/svg+xml',
    ]
    if (!allowedMimeTypes.includes(file.type)) {
      const errorMessage = 'Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, AVIF, SVG).'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }

    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: options?.quality ?? 0.8,
        mimeType: options?.mimeType ?? 'image/webp',
        maxWidth: options?.maxWidth ?? 1920,
        success: async compressedFile => {
          const formData = new FormData()
          formData.append('file', compressedFile, file.name)

          const { error, data } = await actions.files.uploadFileAction(formData)

          if (error || !data) {
            const errorMessage = error?.message ?? 'Error al subir la imagen. Por favor, inténtalo de nuevo.'
            toast.error(errorMessage)
            reject(new Error(errorMessage))
            return
          }

          resolve(data.url.toString())
        },
        error: () => {
          const errorMessage = 'Error al comprimir la imagen. Por favor, inténtalo con otra imagen.'
          toast.error(errorMessage)
          reject(new Error(errorMessage))
        },
      })
    })
  }

  return uploadImage
}
