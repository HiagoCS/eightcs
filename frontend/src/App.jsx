import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import '@/styles/main.scss';
import '@/styles/root.scss';

import { useDynamicLinks } from '@/data/links/functions.jsx';

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';

function App() {
  const { links, isLoading, data } = useDynamicLinks();
  const [showRedirectButton, setShowRedirectButton] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowRedirectButton(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowRedirectButton(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        className="loading-screen"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          padding: '20px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <span>Loading System...</span>

        {showRedirectButton && (
          <button
            type="button"
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL;

              if (apiUrl) {
                window.open(apiUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: '#77BDF1',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              maxWidth: '100%',
            }}
          >
            Acessar servidor
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Banner />
        <NavBar />

        <Routes>
          {data.map((link) => {
            if (links[link.function]) {
              const Component = links[link.function];

              return (
                <Route
                  key={link.url}
                  path={link.url}
                  element={
                    <Component
                      id="pages"
                      type={link.function.toLowerCase().replace('page', '')}
                    />
                  }
                />
              );
            }

            return null;
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;