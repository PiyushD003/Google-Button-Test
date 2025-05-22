import React, { useEffect, useState } from 'react';
import InAppSpy from 'inapp-spy'; // For detecting in-app browsers
import Bowser from 'bowser'; // For parsing user agent strings

interface GoogleButtonProps {
  query: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ query }) => {
  const [isInApp, setIsInApp] = useState(false);
  const [phoneType, setPhoneType] = useState<'android' | 'ios' | undefined>(undefined);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const { isInApp: detectedInApp, ua } = InAppSpy();
    setIsInApp(detectedInApp);

    if (detectedInApp) {
      const parser = Bowser.getParser(ua);
      const osName = parser.getOSName();
      if (osName === 'Android') {
        setPhoneType('android');
      } else if (osName === 'iOS') {
        setPhoneType('ios');
      }
    }

    const url = new URL(window.location.href);
    if (url.searchParams.get('redirected') === 'true') {
      setHasRedirected(true);
      url.searchParams.delete('redirected');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleSearch = (query: string): void => {
    const encodedQuery = encodeURIComponent(query);
    const googleURL = `https://www.google.com/search?q=${encodedQuery}`;

    if (isInApp && phoneType && !hasRedirected) {
      setTimeout(() => {
        if (phoneType === 'android') {
          window.location.href = `intent:${googleURL}?redirected=true#Intent;scheme=https;package=com.android.chrome;end`;
        } else if (phoneType === 'ios') {
          // Note: iOS does not officially support a URL scheme to launch Safari directly.
          // This is a placeholder and may not work as intended.
          window.location.href = `x-safari-${googleURL}?redirected=true`;
        }
      }, 2000); // Delay to allow in-app browser detection
    } else {
      window.open(googleURL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ margin: '20px', justifyContent: 'center', display: 'flex' }}>
      <button onClick={() => handleSearch(query)}>Search Google</button>
    </div>
  );
};

export default GoogleButton;
