import { useEffect, useState } from 'react';
import InAppSpy from 'inapp-spy';
import Bowser from 'bowser';

export const useExternalBrowser = () => {
  const [isInApp, setIsInApp] = useState(false);
  const [phoneType, setPhoneType] = useState<'android' | 'ios' | undefined>(undefined);

  useEffect(() => {
    const { isInApp: inAppResult, ua } = InAppSpy();
    setIsInApp(inAppResult);

    if (inAppResult) {
      const parser = Bowser.getParser(ua);
      const os = parser.getOSName().toLowerCase();
      
      if (os.includes('android')) {
        setPhoneType('android');
      } else if (os.includes('ios')) {
        setPhoneType('ios');
      }
    }
  }, []);

  const openInExternalBrowser = (url: string) => {
    if (isInApp) {
      if (phoneType === 'android') {
        // For Android
        const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = intentUrl;
      } else if (phoneType === 'ios') {
        // For iOS
        const newUrl = url.startsWith('http') ? url : `https://${url}`;
        window.location.href = newUrl;
        
        // Fallback for iOS if the above doesn't work
        setTimeout(() => {
          window.location.href = `googlechrome://${url.replace(/^https?:\/\//, '')}`;
        }, 500);
      }
    } else {
      // For desktop or when not in an in-app browser
      try {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
      } catch (e) {
        window.location.href = url;
      }
    }
  };

  return { openInExternalBrowser, isInApp, phoneType };
};