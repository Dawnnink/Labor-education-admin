/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import { makeLazy } from './utils/lazy'

// Lazily import pages for code-splitting.
const Dashboard = makeLazy(() => import('./pages/Dashboard'))
const Activities = makeLazy(() => import('./pages/activities/Activities'))
const Create = makeLazy(() => import('./pages/activities/Create'))
const Details = makeLazy(() => import('./pages/activities/Details'))
const ActivitiesLayout = makeLazy(
  () => import('./pages/activities/ActivitiesLayout')
)
const Permission = makeLazy(() => import('./pages/Permission'))
const Login = makeLazy(() => import('./pages/Login'))

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <Login />,
  },

  {
    path: '/',
    element: <Index />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'activities',
        element: <ActivitiesLayout />,
        children: [
          {
            path: '',
            element: <Activities />,
          },
          {
            path: 'create',
            element: <Create />,
          },
          {
            path: ':id',
            element: <Details />,
          },
        ],
      },
      {
        path: 'permission',
        element: <Permission />,
      },
    ],
  },
])
