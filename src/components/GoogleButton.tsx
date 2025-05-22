import React from 'react';
import { useExternalBrowser } from '../hooks/useExternalBrowser';

interface GoogleButtonProps {
  query: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ query }) => {
  const { openInExternalBrowser } = useExternalBrowser();

  const handleButtonClick = () => {
    const encodedQuery = encodeURIComponent(query);
    const googleURL = `https://www.google.com/search?q=${encodedQuery}`;
    openInExternalBrowser(googleURL);
  };

  return (
    <div style={{ margin: '20px', justifyContent: 'center', display: 'flex' }}>
      <button onClick={handleButtonClick}>Search Google</button>
    </div>
  );
};

export default GoogleButton;