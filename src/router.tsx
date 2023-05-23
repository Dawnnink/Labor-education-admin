/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import { makeLazy } from './utils/lazy'

// Lazily import pages for code-splitting.
const Dashboard = makeLazy(() => import('./pages/Dashboard'))
const Events = makeLazy(() => import('./pages/events/Events'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'events',
        element: <Events />,
        children: [
          {
            path: 'manage',
            element: <div>活动管理</div>,
          },
        ],
      },
    ],
  },
])
