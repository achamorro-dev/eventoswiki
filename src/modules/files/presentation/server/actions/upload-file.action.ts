import { FilesLocator } from '@/files/di/files.locator'
import { z } from 'astro/zod'
import { defineAction } from 'astro:actions'

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
