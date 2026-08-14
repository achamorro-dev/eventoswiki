import type { Province } from './province'

const CITY_ALIASES_TO_PROVINCE_SLUG: Record<string, string> = {
  bilbao: 'bizkaia',
  barakaldo: 'bizkaia',
  getxo: 'bizkaia',
  vitoria: 'alava',
  'vitoria gasteiz': 'alava',
  gasteiz: 'alava',
  donostia: 'gipuzkoa',
  'san sebastian': 'gipuzkoa',
  eibar: 'gipuzkoa',
  irun: 'gipuzkoa',
  gijon: 'asturias',
  oviedo: 'asturias',
  aviles: 'asturias',
  santander: 'cantabria',
  torrelavega: 'cantabria',
  palma: 'islas-baleares',
  'palma de mallorca': 'islas-baleares',
  ibiza: 'islas-baleares',
  eivissa: 'islas-baleares',
  mahon: 'islas-baleares',
  logrono: 'la-rioja',
  pamplona: 'navarra',
  tudela: 'navarra',
  coruna: 'a-coruna',
  'santiago de compostela': 'a-coruna',
  ferrol: 'a-coruna',
  vigo: 'pontevedra',
  merida: 'badajoz',
  'alcala de henares': 'madrid',
  mostoles: 'madrid',
  getafe: 'madrid',
  leganes: 'madrid',
  alcobendas: 'madrid',
  alcorcon: 'madrid',
  'pozuelo de alarcon': 'madrid',
  'san sebastian de los reyes': 'madrid',
  'las rozas de madrid': 'madrid',
  badalona: 'barcelona',
  'l hospitalet de llobregat': 'barcelona',
  'hospitalet de llobregat': 'barcelona',
  'sant adria de besos': 'barcelona',
  'sant cugat del valles': 'barcelona',
  'santa coloma de gramenet': 'barcelona',
  sabadell: 'barcelona',
  terrassa: 'barcelona',
  mataro: 'barcelona',
  granollers: 'barcelona',
  rubi: 'barcelona',
  'vilanova i la geltru': 'barcelona',
  sitges: 'barcelona',
  'las palmas de gran canaria': 'las-palmas',
  telde: 'las-palmas',
  arucas: 'las-palmas',
  'la laguna': 'santa-cruz-de-tenerife',
  'puerto de la cruz': 'santa-cruz-de-tenerife',
  adeje: 'santa-cruz-de-tenerife',
  marbella: 'malaga',
  torremolinos: 'malaga',
  fuengirola: 'malaga',
  benalmadena: 'malaga',
  estepona: 'malaga',
  elche: 'alicante',
  benidorm: 'alicante',
  torrevieja: 'alicante',
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export class ProvinceCollection {
  constructor(private readonly provinces: Province[]) {}

  slugWithName(name?: string): string | undefined {
    if (!name) return undefined

    return this.provinces.find(province => province.name === name)?.slug
  }

  slugWithCity(city?: string | null): string | undefined {
    if (!city) return undefined

    const normalizedCity = normalize(city)

    const provinceByName = this.provinces.find(
      province => normalize(province.name) === normalizedCity || province.slug === normalizedCity,
    )
    if (provinceByName) return provinceByName.slug

    return CITY_ALIASES_TO_PROVINCE_SLUG[normalizedCity]
  }
}
