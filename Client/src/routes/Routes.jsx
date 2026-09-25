import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Profile from '../pages/Profile'
import Cart from '../pages/Cart'
import NotFound from '../pages/NotFound'
import ProductDetails from '../pages/ProductDetails'
import Wishlist from '../pages/Wishlist'
import Loader from '../components/Loader'
import AccountSettings from '../pages/profile/AccountSettings'
import MyOrders from '../pages/profile/MyOrders'
import Addresses from '../pages/profile/Addresses'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import Checkout from '../pages/Checkout'
import OrderStatus from '../pages/OrderStatus'
import ProtectedRoute from './ProtectedRoute'
import AuthRoute from './AuthRoute'
import App from '../App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: < Home />
      },
      {
        path: '/shop',
        element: <Shop />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        element: <AuthRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />
          },
          {
            path: '/register',
            element: <RegisterPage />
          },
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
            children: [
              {
                index: true,
                element: <Navigate to='accountsettings' replace />,
              },
              {
                path: 'accountsettings',
                element: <AccountSettings />,
              },
              {
                path: 'myorders',
                element: <MyOrders />
              },
              {
                path: 'addresses',
                element: <Addresses />
              },
            ]
          },
          {
            path: '/checkout',
            element: <Checkout />
          },
          {
            path: '/orderstatus/:orderId',
            element: <OrderStatus />
          },
        ]
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/wishlist',
        element: <Wishlist />
      },
      {
        path: '/product/:slug',
        element: <ProductDetails />
      },
      {
        path: '*',
        element: <NotFound />
      },

    ]
  }
])

function Routes() {
  return (
    <RouterProvider router={router} />
  )
}
export default Routes