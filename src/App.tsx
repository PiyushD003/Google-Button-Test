import React from 'react';
import GoogleButton from './components/GoogleButton';

const App: React.FC = () => {
  return (
    <>
      <h1>Google Search Button</h1>
      <GoogleButton query="One Plus 13s" />
    </>
  );
};

export default App;