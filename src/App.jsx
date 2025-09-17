import { useState } from 'react'
import './App.css'
import { Outlet,useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { AnimatePresence } from "framer-motion";

function App() {
  // const [count, setCount] = useState(0)
  const location = useLocation();


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App
