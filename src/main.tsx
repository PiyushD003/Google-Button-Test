import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import InAppSpy from 'inapp-spy'
import Bowser from 'bowser'
import App from './App.tsx'

// Check for in-app browser and redirect if needed
(function() {
  const { isInApp, ua } = InAppSpy();

  if (!isInApp) return;

  const parser = Bowser.getParser(ua);
  const os = parser.getOSName();

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  // Prevent infinite redirect loops
  if (url.searchParams.get('redirected') === 'true') return;

  url.searchParams.set('redirected', 'true');
  const cleanUrl = url.toString();

  if (os === 'Android') {
    window.location.href = `intent://${url.host}${url.pathname}?${url.searchParams.toString()}#Intent;scheme=https;package=com.android.chrome;end`;
  } else if (os === 'iOS') {
    window.location.href = `x-safari-${cleanUrl}`;
  }
})();

// Render the app only if not redirecting
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)