export default function MatchScoreLogo({ size = 'md' }) {
  const sizes = {
    sm: 'text-[22px]',
    md: 'text-[26px]',
    lg: 'text-[33px]',
    xl: 'text-[40px]',
  }
  return (
    <div className={`${sizes[size]} font-extrabold tracking-tight select-none`} style={{ fontFamily: 'Kanit, sans-serif' }}>
      <span className="text-[#db2777]">Match</span>
      <span className="text-[#e8edf2]">Score</span>
    </div>
  )
}
