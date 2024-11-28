export interface ReactInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'default' | 'chip'
}
