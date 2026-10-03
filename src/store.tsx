import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import { loadState, type LeagueState } from './data'
const Context = createContext<{ state: LeagueState; setState: Dispatch<SetStateAction<LeagueState>>; notify: (message: string) => void } | null>(null)
export function LeagueProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState)
  const [notice, setNotice] = useState('')
  useEffect(() => { try { localStorage.setItem('lanedesk-league-v1', JSON.stringify(state)) } catch { setNotice('Browser storage is full. Your changes will not survive a refresh.') } }, [state])
  useEffect(() => { if (notice) { const timeout = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timeout) } }, [notice])
  return <Context.Provider value={{ state, setState, notify: setNotice }}>{children}{notice && <div className="toast" role="status"><span className="toast-dot" />{notice}</div>}</Context.Provider>
}
export function useLeague() { const context = useContext(Context); if (!context) throw new Error('LeagueProvider is required'); return context }
