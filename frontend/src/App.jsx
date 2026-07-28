import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '@/styles/main.scss'
import {data} from '@/data/links';
import {links} from '@/data/links/functions.jsx';

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';


function App() {
  return (
    <div className="App">
      <Router>
        <Banner></Banner>
        <NavBar></NavBar>
        <Routes>
          {data.map((link, index) => {
            const Component = links[link.name];
            return (
              <Route key={index} path={link.url} element={<Component />} />
            );
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App
