import { PINATA_GATEWAY_URL, PINATA_JWT } from 'astro:env/server'
import { PinataSDK } from 'pinata'
import type { FilesRepository } from '../../domain/files.repository'

export class PinataFilesRepository implements FilesRepository {
  private readonly pinata: PinataSDK

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: PINATA_JWT,
      pinataGateway: PINATA_GATEWAY_URL,
    })
  }

  async upload(file: File): Promise<URL> {
    const response = await this.pinata.upload.public.file(file)
    const url = await this.pinata.gateways.public.convert(response.cid)

    return new URL(url)
  }
}
