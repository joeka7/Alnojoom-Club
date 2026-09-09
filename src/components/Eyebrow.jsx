import '../css/Eyebrow.css'

export default function Eyebrow({ children, light = false }) {
  return (
    <span className={`eyebrow${light ? ' eyebrow--light' : ''}`}>
      <span className="eyebrow__line" />
      {children}
    </span>
  )
}
