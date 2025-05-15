export interface FilesRepository {
  upload(file: File): Promise<URL>
}
