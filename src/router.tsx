/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import { makeLazy } from './utils/lazy'

// Lazily import pages for code-splitting.
const Dashboard = makeLazy(() => import('./pages/Dashboard'))
const Events = makeLazy(() => import('./pages/events/Events'))
const Create = makeLazy(() => import('./pages/events/Create'))
const Details = makeLazy(() => import('./pages/events/Details'))
const EventsLayout = makeLazy(() => import('./pages/events/EventsLayout'))

export const router = createBrowserRouter([
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
        path: 'events',
        element: <EventsLayout />,
        children: [
          {
            path: '',
            element: <Events />,
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
    ],
  },
])
