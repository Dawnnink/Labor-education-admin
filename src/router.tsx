/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import { makeLazy } from './utils/lazy'
import { useStore } from './utils/store'

// Lazily import pages for code-splitting.
const Dashboard = makeLazy(() => import('./pages/Dashboard'))
const Activities = makeLazy(() => import('./pages/activities/Activities'))
const Create = makeLazy(() => import('./pages/activities/Create'))
const Details = makeLazy(() => import('./pages/activities/Details'))
const Check = makeLazy(() => import('~/pages/activities/Check'))
const Permission = makeLazy(() => import('./pages/Permission'))
const Login = makeLazy(() => import('./pages/Login'))
const ReEdit = makeLazy(() => import('~/pages/activities/ActivityReEdit'))
const Continue = makeLazy(() => import('./pages/activities/ContinueSet'))
const IndexLoginGuard = () => {
  const token = useStore((state) => state.token)
  if (!token) {
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
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'activities',
        element: <Activities />,
      },
      {
        path: 'reset/:id',
        element: <ReEdit />
      }
      ,
      {
        path: "activities/:id",
        element: <Details />,
      },
      {
        path: 'create',
        element: <Create />,
      },
      {
        path: 'permission',
        element: <Permission />,
      },
      {
        path: 'check',
        element: <Check />,
      }, {
        path: 'continue/-1',
        element: <Continue />,
      }
    ],
  },
])
