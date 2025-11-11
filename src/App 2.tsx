import React from 'react';
import Logo from './Logo-Key.svg'; // Make sure this path is correct and matches the folder structure exactly

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Typing Speed Test</h1>

      {/* Ensure Logo-Key.svg exists in ./images/ */}
      <img src={Logo} alt="Logo" width={150} />
    </div>
  );
}

export default App;
