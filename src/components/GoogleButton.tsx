// GoogleButton.tsx
import React, { useEffect, useState } from 'react';
import InAppSpy from 'inapp-spy'; // Install with: npm i inapp-spy
import Bowser from 'bowser';      // Install with: npm i bowser

interface GoogleButtonProps {
  query: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ query }) => {
  const [isInApp, setIsInApp] = useState(false);
  const [phoneType, setPhoneType] = useState<'android' | 'ios' | undefined>(undefined);
  const [hasRedirected, setHasRedirected] = useState(false);

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

    const url = new URL(window.location.href);
    if (url.searchParams.get('redirected') === 'true') {
      setHasRedirected(true);
      url.searchParams.delete('redirected');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    if (isInApp && phoneType && !hasRedirected) {
      const timer = setTimeout(() => {
        const encodedQuery = encodeURIComponent(query);

        if (phoneType === 'android') {
          // Redirect to Chrome using intent on Android
          window.location.href = `intent://www.google.com/search?q=${encodedQuery}&redirected=true#Intent;scheme=https;package=com.android.chrome;end`;
        } else if (phoneType === 'ios') {
          // Redirect to Safari using x-safari on iOS
          window.location.href = `x-safari-https://www.google.com/search?q=${encodedQuery}&redirected=true`;
        }
      }, 2000); // Wait for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isInApp, phoneType, hasRedirected, query]);

  const handleSearch = (query: string): void => {
    const encodedQuery = encodeURIComponent(query);
    const googleURL = `https://www.google.com/search?q=${encodedQuery}`;
    window.open(googleURL, '_blank', 'noopener,noreferrer');
  };

  const handleButtonClick = () => {
    if (!isInApp) {
      handleSearch(query);
    }
  };

  return (
    <div style={{ margin: '20px', justifyContent: 'center', display: 'flex' }}>
      <button onClick={handleButtonClick}>Search Google</button>
    </div>
  );
};

export default GoogleButton;
