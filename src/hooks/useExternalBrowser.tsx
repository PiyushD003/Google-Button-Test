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
      const os = parser.getOSName();

      if (os === 'Android') {
        setPhoneType('android');
      } else if (os === 'iOS') {
        setPhoneType('ios');
      }
    }
  }, []);

  const openInExternalBrowser = (url: string) => {
    if (!isInApp || !phoneType) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (phoneType === 'android') {
      window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (phoneType === 'ios') {
      window.location.href = `x-safari-${url}`;
    }
  };

  return { openInExternalBrowser, isInApp, phoneType };
};