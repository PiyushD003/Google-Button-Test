import { useCallback } from 'react';
import InAppSpy from 'inapp-spy';
import Bowser from 'bowser';

export const useExternalBrowser = () => {
  const openInExternalBrowser = useCallback((url: string) => {
    const { isInApp, ua } = InAppSpy();
    
    if (!isInApp) {
      // Not in an in-app browser, open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const parser = Bowser.getParser(ua);
    const os = parser.getOSName().toLowerCase();
    
    const urlObj = new URL(url);
    urlObj.searchParams.set('redirected', 'true');

    if (os.includes('android')) {
      window.location.href = `intent://${urlObj.host}${urlObj.pathname}?${urlObj.searchParams.toString()}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (os.includes('ios')) {
      window.location.href = `x-safari-${urlObj.toString()}`;
    }
  }, []);

  return { openInExternalBrowser };
};