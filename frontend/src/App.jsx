import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/styles/main.scss'
import '@/styles/root.scss'
import {data} from '@/data/links';
import {links} from '@/data/links/functions.jsx';

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';


function App() {
  return (
    <div className="App">
      <Router>
        <Banner />
        <NavBar />
        <hr />
        <Routes>
          {data.map((link) => {
            const Component = links[link.name];
            return (
              <Route key={link.url} path={link.url} element={<Component />} />
            );
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App
