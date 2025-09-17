import React from 'react'
import logo from "../../assets/Tree.svg"
import { Link } from 'react-router-dom'

function Footer() {
  return (
     <footer className="bg-black text-white">
      <div className="mx-auto w-full max-w-screen-xl  py-3 lg:py-4">
        <div className="flex flex-wrap justify-between items-center px-3 max-w-screen-xl mx-auto">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="mr-3 h-28 w-auto" />
          </div>
          <div>
            <Link
            to = "/about"
            >
            about
            </Link>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} TreeStack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer