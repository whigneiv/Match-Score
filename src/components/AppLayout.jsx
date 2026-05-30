import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import VipShop from './VipShop'
import DailySpin from './DailySpin'
import InteractiveHelpGuide from './InteractiveHelpGuide'
import { useMatchScore } from '../context/MatchScoreContext'
import { playClick } from '../lib/audio'

export default function AppLayout() {
  const {
    showShop,
    setShowShop,
    showSpin,
    setShowSpin,
    showHelp,
    setShowHelp,
  } = useMatchScore()

  return (
    <div className="min-h-screen flex flex-col relative">
      <SiteHeader />
      <main className="flex-1 px-3 py-3 sm:px-4">
        <Outlet />
      </main>

      {/* Global Modals rendered outside header stacking context */}
      {showShop && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-xs sm:max-w-sm my-auto rounded-2xl bg-[#162230]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <VipShop
              onClose={() => {
                playClick()
                setShowShop(false)
              }}
            />
          </div>
        </div>
      )}

      {showSpin && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-xs sm:max-w-sm my-auto rounded-2xl bg-[#162230]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <DailySpin
              onClose={() => {
                playClick()
                setShowSpin(false)
              }}
            />
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md my-auto rounded-2xl bg-[#162230]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <InteractiveHelpGuide
              onClose={() => {
                playClick()
                setShowHelp(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
