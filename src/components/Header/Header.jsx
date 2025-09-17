import { useState } from 'react'
import logo from "../../assets/TreeStack.svg"
import { useAuth } from '../../context/AuthProvider';
import { Link, useNavigate } from "react-router-dom"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { easeIn, easeInOut, motion } from "framer-motion";
import { Tally3, Menu } from "lucide-react"

function Header() {
  const { user, loading, setUser, showleft, setLeftSide } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // handle logout
  const logout = async () => {
    try {
      const r = await fetch(`${BACKEND_URL}/api/user/logout`, { credentials: "include" });
      const res = await r.json();

      if (res.success) {
        const me = await fetch(`${BACKEND_URL}/api/user/me`, { credentials: "include" });
        const meData = await me.json();

        setUser(meData.user);
        setDropdownOpen(false);
        alert("you are successfully logout")
        navigate('/');
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className="shadow sticky z-50 top-0 font-serif">
      <nav className='bg-black text-white flex justify-between items-center h-20 px-4'>
        <div className='bg-amber-9550 h-full flex'>
          {user ? (
            <>
            <img src={logo} alt="logo"
              className='h-full w-auto'
            />
             <button
            className=" text-white rounded-md"
            onClick={() => setLeftSide(!showleft)}
          >
            <motion.div
              key={showleft ? "menu" : "tally"} // forces re-animation when icon changes
              initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className='cursor-pointer'
            >
              {showleft ?  <Tally3 />:<Menu /> }
            </motion.div>
          </button>
          </>
          ) : (<Link
            to="/"
          >
            <img src={logo} alt="logo"
              className='h-full w-auto'
            />
          </Link>)}
         
        </div>

        <div className='bg-amber-8500 flex items-center p-1 space-x-4 w-auto lg:w-1/3 justify-center gap-3'>
          <div className='text-green-300 hidden sm:block'>
            <Link
              to="/about"
            >
              About
            </Link>
          </div>
          <div className='bg-amber-9500 text-white flex items-center space-x-4 px-2 py-1 rounded-md'>
            {user ? (
              <div className='relative'>
                <div className="flex justify-center items-center p-2 cursor-pointer "
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className='w-full flex justify-center items-center'>
                    <img src={user.profileImageURL}
                      crossOrigin="anonymous"
                      alt="profile"
                      className="h-9 w-9 rounded-full object-cover border-2 border-[#53ad81]"
                    />
                  </div>
                </div>
                {/*dropdown */}
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: easeInOut }}
                    className="absolute z-10 right-0 mt-2 w-40  text-black rounded-md shadow-lg overflow-hidden
                bg-gradient-to-b from-[#000f1e] via-[#3e0151a5 to-[#3e0151]
                ">
                    <li>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-800 cursor-pointer text-gray-400"
                      >
                        Logout
                      </button>
                    </li>
                    <li>
                      <button
                        // onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 hover:bg-[#550303ae] text-red-600"
                      >
                        Delete Account
                      </button>
                    </li>
                  </motion.ul>
                )}
              </div>
            ) :
              <>
                <div>
                  <Link
                    to="/signin"
                  >
                    Login
                  </Link>

                </div>
                <div className='bg-green-500 text-black py-2 px-2 rounded-2xl text-sm sm:text-base'>
                  <Link
                    to="/signup"
                  >
                    CREATE ACCOUNT
                  </Link>
                </div>
              </>}
          </div>
        </div>

      </nav>
    </header>
  )
}

export default Header