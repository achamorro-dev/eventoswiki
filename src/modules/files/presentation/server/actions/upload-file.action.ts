import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { UploadFileCommand } from '@/files/application/upload-file.command'
import { FilesContainer } from '@/files/di/files.container'

export const uploadFileAction = defineAction({
  accept: 'form',
  input: z.object({
    file: z.instanceof(File),
  }),
  handler: async input => {
    const { file } = input

    const uploadFileCommand = FilesContainer.get(UploadFileCommand)
    const url = await uploadFileCommand.execute(file)

    return {
      url,
    }
  },
})
