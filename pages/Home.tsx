import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>WristHub PK - Premium Watches in Pakistan</title>
        <meta name="description" content="WristHub PK offers the finest collection of premium watches in Pakistan. Shop luxury timepieces with cash on delivery and fast shipping." />
      </Helmet>
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
    </>
  );
};

export default Home;