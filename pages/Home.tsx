import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '50px',
      background: '#f7f7f7',
      color: '#333',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '50px', marginBottom: '20px' }}>🚧 We'll Be Back Soon!</h1>
      <p style={{ fontSize: '20px' }}>We are updating our store for a better experience. Please check back shortly.</p>
    </div>
  );
};

export default Home;