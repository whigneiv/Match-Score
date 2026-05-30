export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl bg-[#162230] border border-white/[0.06] shadow-xl shadow-black/20 p-4 ${className}`}>
      {children}
    </div>
  )
}
