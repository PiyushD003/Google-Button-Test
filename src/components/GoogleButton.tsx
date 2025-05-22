// GoogleButton.tsx
import React, { useEffect, useState } from 'react';
import InAppSpy from 'inapp-spy'; // npm install inapp-spy
import Bowser from 'bowser';      // npm install bowser

interface GoogleButtonProps {
  query: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ query }) => {
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

  const redirectToExternalBrowser = () => {
    const encodedQuery = encodeURIComponent(query);

    if (phoneType === 'android') {
      window.location.href = `intent://www.google.com/search?q=${encodedQuery}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (phoneType === 'ios') {
      window.location.href = `x-safari-https://www.google.com/search?q=${encodedQuery}`;
    }
  };

  const handleButtonClick = () => {
    const encodedQuery = encodeURIComponent(query);
    const googleURL = `https://www.google.com/search?q=${encodedQuery}`;

    if (isInApp && phoneType) {
      redirectToExternalBrowser();
    } else {
      window.open(googleURL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ margin: '20px', justifyContent: 'center', display: 'flex' }}>
      <button onClick={handleButtonClick}>Search Google</button>
    </div>
  );
};

export default GoogleButton;
