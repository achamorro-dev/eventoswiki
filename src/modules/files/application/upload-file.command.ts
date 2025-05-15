import { Command } from '@/shared/application/use-case/command'
import type { FilesRepository } from '../domain/files.repository'

export class UploadFileCommand extends Command<File, URL> {
  constructor(private readonly filesRepository: FilesRepository) {
    super()
  }

  async execute(file: File): Promise<URL> {
    return this.filesRepository.upload(file)
  }
}
