import { useState } from 'react'
import BottomTabNav, { type TabId } from './components/BottomTabNav'
import TerminalHero from './components/TerminalHero'
import Portfolio from './components/Portfolio'
import OSDesktop from './components/OSDesktop'
import IdeaNotes from './components/IdeaNotes'
import DailyLog from './components/DailyLog'
import AIDigest from './components/AIDigest'
import Footer from './components/Footer'

function App() {
  const [tab, setTab] = useState<TabId>('home')

  return (
    <div className="min-h-screen bg-paper">
      <div key={tab} className="fade-up">
        {tab === 'home' && <TerminalHero />}
        {tab === 'portfolio' && <Portfolio />}
        {tab === 'os' && <OSDesktop onNavigate={setTab} />}
        {tab === 'ideas' && <IdeaNotes />}
        {tab === 'log' && (
          <>
            <DailyLog />
            <AIDigest />
            <Footer />
          </>
        )}
      </div>
      <BottomTabNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
