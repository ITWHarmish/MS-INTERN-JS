import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import MainPage from './components/MainPage.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import Login from './components/auth/Login.tsx'
import { ConfigProvider } from 'antd'
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
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>

  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#c9194b',
          borderRadius: 20,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>

  // </StrictMode> 
)
