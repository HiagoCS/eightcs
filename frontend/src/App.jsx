import { useState } from 'react'
import '@/styles/main.scss'

import Banner from '@/components/banner';
import NavBar from '@/components/navbar';
import Home from '@/components/folders/home';

function App() {

  return (
    <div className="App">
      <Banner></Banner>
      <NavBar></NavBar>
      <Home></Home>
    </div>
  )
}

export default App
