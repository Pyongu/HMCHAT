import React, { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Chat from "./components/chatfront/Chat";
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <div className="h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
  ) : (
    <>
      <Navbar />
      <Chat />
    </>
  );
}


export default App;