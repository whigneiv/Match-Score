import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MatchScoreProvider } from './context/MatchScoreContext'
import AppLayout from './components/AppLayout'
import Overview from './pages/Overview'

export default function App() {
  return (
    <MatchScoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MatchScoreProvider>
  )
}
