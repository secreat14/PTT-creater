import { Settings } from 'lucide-react';
import { useEffect } from 'react';
import { PptPresenter, PptReader } from './features/ppt-reader/PptReader';

// This application-owned host is optional. Core controls also have a direct URL.
export function App() {
  const presenterMode = new URLSearchParams(window.location.search).get('mode') === 'present';
  useEffect(() => {
    document.body.classList.toggle('ppt-presenter-window', presenterMode);
    return () => document.body.classList.remove('ppt-presenter-window');
  }, [presenterMode]);
  if (presenterMode) return <PptPresenter />;
  return <>
    <PptReader />
    <a className="kernel-settings-launcher" href="/__saplingagent/kernel" target="_blank" rel="noopener" aria-label="Open settings" title="Open settings">
      <Settings aria-hidden="true" size={19} strokeWidth={1.8} />
    </a>
    <iframe title="Saplingagent version" src="/__saplingagent/kernel?footer" style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 4, width: 310, height: 25, border: 0, zIndex: 10, pointerEvents: 'none' }} />
  </>;
}
