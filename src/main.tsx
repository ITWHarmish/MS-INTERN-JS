import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import MainPage from './components/MainPage.tsx'
import Dashboard from './components/Dashboard.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import Login from './components/auth/Login.tsx'
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

  // </StrictMode> 
)
