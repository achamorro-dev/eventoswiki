import clsx from 'clsx'

type ClassDictionary = { [id: string]: boolean | undefined | null }
type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false
type ClassArray = ClassValue[]

export const classnames = (...classes: ClassValue[]) => {
  return clsx(classes)
}
