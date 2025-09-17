import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"


//components import:-
import Signup from './components/Signup.jsx'
import Signin from './components/Signin.jsx'
import LandingPage from './components/LandingPage.jsx'
import HomePage from './components/HomePage.jsx'
import Otp from './components/Otp.jsx'
import About from './components/About.jsx'
import EditFolder from './components/EditFolder.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/signup",
        element: <Signup />
      },
      {
        path: "/signin",
        element: <Signin />
      },
      {
        path: "/landingpage",
        element: <LandingPage />
      },
      {
        path: "/otp",
        element: <Otp />
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path:"/editfolder",
        element:<EditFolder/>
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
