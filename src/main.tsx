import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import InAppSpy from 'inapp-spy'
import Bowser from 'bowser'
import App from './App.tsx'

// Check for in-app browser and redirect if needed
const shouldRenderApp = (function() {
  try {
    const { isInApp, ua } = InAppSpy();

    if (!isInApp) return true;

    const parser = Bowser.getParser(ua);
    const os = parser.getOSName().toLowerCase();

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    // Prevent infinite redirect loops
    if (url.searchParams.get('redirected') === 'true') return true;

    url.searchParams.set('redirected', 'true');
    const cleanUrl = url.toString();

    if (os.includes('android')) {
      window.location.href = `intent://${url.host}${url.pathname}?${url.searchParams.toString()}#Intent;scheme=https;package=com.android.chrome;end`;
      return false;
    } else if (os.includes('ios')) {
      window.location.href = `x-safari-${cleanUrl}`;
      setTimeout(() => {
        window.location.href = `googlechrome://${url.host}${url.pathname}?${url.searchParams.toString()}`;
      }, 500);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Browser detection failed:', error);
    return true;
  }
})();

// Only render if we're not redirecting
if (shouldRenderApp) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} else {
  // Show loading or blank page while redirecting
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: sans-serif;
      color: #333;
      background-color: #fff;
    ">
      Opening in external browser...
    </div>
  `;
}