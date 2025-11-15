import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'
import { FilesLocator } from '@/files/di/files.locator'

export const uploadFileAction = defineAction({
  accept: 'form',
  input: z.object({
    file: z.instanceof(File),
  }),
  handler: async input => {
    const { file } = input

    const url = await FilesLocator.uploadFileCommand.execute(file)

    return {
      url,
    }
  },
})
