import './FixedBackButton.css'

export interface FixedBackButtonProps {
  label: string
  onBack: () => void
}

export function FixedBackButton({ label, onBack }: FixedBackButtonProps) {
  return <button aria-label={label} className="fixed-back-button" onClick={onBack} type="button">← {label}</button>
}
