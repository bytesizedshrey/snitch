import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './AppLayout'
import Home from '../features/home/pages/Home'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import Dashboard from '../features/products/pages/Dashboard'
import CreateProduct from '../features/products/pages/CreateProduct'
import SellerProductDetails from '../features/products/pages/SellerProductDetails'
import Protected from '../features/auth/components/Protected';
import ProductDetail from '../features/products/pages/ProductDetail';
import Cart from '../features/cart/pages/Cart';
import Checkout from '../features/cart/pages/Checkout';
import OrderSuccess from '../features/cart/pages/OrderSuccess';
import OrderFailed from '../features/cart/pages/OrderFailed';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path : "/product/:productId",
        element : <ProductDetail/>
      },
      {
        path : "/cart",
        element : <Protected><Cart /></Protected>
      },
      {
        path : "/checkout",
        element : <Protected><Checkout /></Protected>
      },
      {
        path : "/order/success",
        element : <Protected><OrderSuccess /></Protected>
      },
      {
        path : "/order/failed",
        element : <Protected><OrderFailed /></Protected>
      }
    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Protected role="seller"><Dashboard /></Protected>
  },
  {
    path: "/seller",
    children: [
      {
        path : '/seller/create-product',
        element : <Protected role="seller"><CreateProduct/></Protected>
      },
      {
        path : '/seller/dashboard',
        element : <Protected role="seller"><Dashboard/></Protected>
      },
      {
        path : '/seller/product/:productId',
        element : <Protected role="seller"><SellerProductDetails/></Protected>
      }
    ]
  }
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
