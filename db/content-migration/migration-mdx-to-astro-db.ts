import { readFileSync, readdirSync } from 'fs'

const regexKeyValue = /(\w+):\s*(?:"([^"]*)"|'([^']*)'|(.+))/

export const getEventsFor = (folder: string, year: string) => {
  if (!folder || !year) {
    console.error('Please provide the folder (eventos or meetups) and year as params, for example: eventos 2024')
    process.exit(1)
  }

  return processFiles(folder, year)
}

async function processFiles(folder: string, year: string) {
  const eventsMdxFiles = getListOfMdxFiles(folder, year)

  return getParsedEvents(eventsMdxFiles, folder, year)
}

function getParsedEvents(eventsMdxFiles: string[], folder: string, year: string) {
  return eventsMdxFiles.map(file => {
    console.log('Reading file:', file)
    const mdx = readFileSync(`src/content/data/${folder}/${year}/${file}`, 'utf-8')
    const mdxContent = mdx.split('---').slice(1)
    const [metadata, content] = mdxContent

    let data = metadata.split('\n').reduce((acc, line) => {
      const isEmptyLine = line === ''
      if (isEmptyLine) return acc

      const match = line.match(regexKeyValue)
      if (!match) return acc
      let key = match[1]
      let value: string | Date = match[2] || match[3] || match[4]

      if (key === 'layout') return acc

      if (key === 'tags') {
        value = line.split(':').slice(1).join().replace('[', '').replace(']', '').trim()
      }

      if (key === 'startDate') {
        key = 'startsAt'
        value = new Date(value)
      }

      if (key === 'endDate') {
        key = 'endsAt'
        value = new Date(value)
      }

      return { ...acc, [key]: value }
    }, {})

    data = {
      ...data,
      slug: `${year}/${file.replace('.mdx', '')}`,
    }

    return { ...data, content }
  })
}

function getListOfMdxFiles(folder: string, year: string) {
  return readdirSync(`src/content/data/${folder}/${year}`).filter(file => file.endsWith('.mdx'))
}
