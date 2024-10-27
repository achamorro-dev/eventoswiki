export interface Input extends astroHTML.JSX.InputHTMLAttributes {
  label?: string
  error?: string
  variant?: 'default' | 'chip'
}
