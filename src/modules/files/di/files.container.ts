import { ContainerBuilder } from 'diod'
import { UploadFileCommand } from '../application/upload-file.command'
import { FilesRepository } from '../domain/files.repository'
import { PinataFilesRepository } from '../infrastructure/repositories/pinata-files.repository'

const builder = new ContainerBuilder()
builder.register(FilesRepository).use(PinataFilesRepository)
builder.register(UploadFileCommand).use(UploadFileCommand).withDependencies([FilesRepository])

export const FilesContainer = builder.build({ autowire: false })
