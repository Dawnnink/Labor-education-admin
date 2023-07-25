/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Index from '~/pages/Index'
import { useStore } from '~/utils/store'

import Dashboard from '~/pages/Dashboard'
import Activities from '~/pages/activities/Activities'
import Create from '~/pages/activities/Create'
import Details from '~/pages/activities/Details'
import Permission from '~/pages/Permission'
import ReEdit from '~/pages/activities/ActivityReEdit'
import Login from '~/pages/Login'
import Continue from '~/pages/activities/ContinueSet'
import Check from '~/pages/Check'
import { network } from './utils/network'

const IndexLoginGuard = () => {
  const token = useStore((state) => state.token)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  const root = network.getRoot();
  if (!root) {
    return <Navigate to="/login" replace />
  }
  return <Index />
}

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },

  {
    path: '/',
    element: <IndexLoginGuard />,
    children: [
      {
        path: '',
        element: <Navigate to="/activities" replace />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/activities',
        element: <Activities />,
      },
      {
        path: '/reset/:id',
        element: <ReEdit />
      }
      ,
      {
        path: "/activities/:id",
        element: <Details />,
      },
      {
        path: '/create',
        element: <Create />,
      },
      {
        path: '/permission',
        element: <Permission />,
      },
      {
        path: '/continue/-1',
        element: <Continue />,
      },
      {
        path: '/check',
        element: <Check />,
      }
    ],
  },
])
