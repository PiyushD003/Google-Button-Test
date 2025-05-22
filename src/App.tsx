import React, { useEffect } from 'react';
import GoogleButton from './components/GoogleButton';
import { useExternalBrowser } from './hooks/useExternalBrowser';

const App: React.FC = () => {
  const { isInApp, openInExternalBrowser } = useExternalBrowser();

  useEffect(() => {
    // If in an in-app browser, redirect the entire site
    if (isInApp) {
      openInExternalBrowser(window.location.href);
    }
  }, [isInApp]);

  return (
    <>
      <h1>Google Search Button</h1>
      <GoogleButton query={"One Plus 13s"} />
    </>
  );
};

export default App;