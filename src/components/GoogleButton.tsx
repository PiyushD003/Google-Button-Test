// GoogleButton.tsx
import React, { useEffect, useState } from 'react';
import InAppSpy from 'inapp-spy'; // Library to detect if the app is running inside an in-app browser
import Bowser from 'bowser';      // Library to parse user agent and detect OS/browser

// Props interface: expects a 'query' string to search on Google
interface GoogleButtonProps {
  query: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ query }) => {
  // State to check if user is in an in-app browser (e.g., Instagram, Facebook)
  const [isInApp, setIsInApp] = useState(false);

  // State to track device OS: 'android', 'ios', or undefined
  const [phoneType, setPhoneType] = useState<'android' | 'ios' | undefined>(undefined);

  // useEffect runs once on component mount
  useEffect(() => {
    // Use InAppSpy to detect in-app browser and get user-agent string
    const { isInApp: inAppResult, ua } = InAppSpy();
    setIsInApp(inAppResult); // Update in-app browser state

    if (inAppResult) {
      // Use Bowser to determine the OS from user-agent
      const parser = Bowser.getParser(ua);
      const os = parser.getOSName();

      // Set phone type based on OS
      if (os === 'Android') {
        setPhoneType('android');
      } else if (os === 'iOS') {
        setPhoneType('ios');
      }
    }
  }, []);

  // Redirect function: opens Google search in external browser (Chrome or Safari)
  const redirectToExternalBrowser = () => {
    const encodedQuery = encodeURIComponent(query); // Encode the query for URL

    if (phoneType === 'android') {
      // Use Android's 'intent' URI to open in Chrome directly
      window.location.href = `intent://www.google.com/search?q=${encodedQuery}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (phoneType === 'ios') {
      // Use Safari's custom URI scheme for iOS
      window.location.href = `x-safari-https://www.google.com/search?q=${encodedQuery}`;
    }
  };

  // When the user clicks the button:
  const handleButtonClick = () => {
    const encodedQuery = encodeURIComponent(query);
    const googleURL = `https://www.google.com/search?q=${encodedQuery}`;

    if (isInApp && phoneType) {
      // If in in-app browser, redirect to external browser
      redirectToExternalBrowser();
    } else {
      // Otherwise, just open a new tab (regular behavior)
      window.open(googleURL, '_blank', 'noopener,noreferrer');
    }
  };

  // JSX to render a centered button
  return (
    <div style={{ margin: '20px', justifyContent: 'center', display: 'flex' }}>
      <button onClick={handleButtonClick}>Search Google</button>
    </div>
  );
};

export default GoogleButton;
