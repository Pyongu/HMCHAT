import React, { useState, useEffect } from 'react';
import './index.css';
import { HashRouter, Routes, Route } from 'react-router-dom'
import {Login} from './components/popup/login.tsx'
import { Home } from './home.jsx'



function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path = "/" element={<Login/>}/>
        <Route path="/home.jsx" element = {<Home/>}/>
      </Routes>
    </HashRouter>
  )
}


export default App;