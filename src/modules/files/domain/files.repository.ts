export abstract class FilesRepository {
  abstract upload(file: File): Promise<URL>
}
