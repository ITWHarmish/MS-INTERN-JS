import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './components/Home.tsx'
import Dashboard from './components/Dashboard.tsx'
import Timelog from './components/Timelog.tsx'
import MainPage from './components/MainPage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />
        // element: <Home /> 
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/timelog",
        element: <Home />
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </StrictMode>,
)
