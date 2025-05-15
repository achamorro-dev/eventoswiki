import { UploadFileCommand } from '../application/upload-file.command'
import { PinataFilesRepository } from '../infrastructure/repositories/pinata-files.repository'

export class FilesLocator {
  static readonly uploadFileCommand = new UploadFileCommand(new PinataFilesRepository())
}
