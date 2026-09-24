import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/styles/main.scss'
import '@/styles/root.scss'
import { useDynamicLinks  } from '@/data/links/functions.jsx';

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';


function App() {
  const { links, isLoading, data } = useDynamicLinks();
  if(isLoading) return <div className="loading-screen">Loading System...</div>;
  return (
    <div className="App">
      <Router>
        <Banner></Banner>
        <NavBar></NavBar>
        <Routes>
          {data.map((link) => {
            if (links[link.function]) {
              const Component = links[link.function];
              return (
                <Route key={link.url} path={link.url} element={<Component id="pages" type={link.function.toLowerCase().replace("page","")} />} />
              );
            }
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App
