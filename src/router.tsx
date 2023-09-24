/* eslint-disable react-refresh/only-export-components */
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Index from '~/pages/Index'
import { useCrenditial, useStore } from '~/utils/store'

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
import { CheckHall } from './pages/Check/CheckHall'
import { useEffect } from 'react'

const IndexLoginGuard = () => {
  const token = useStore((state) => state.token)
  useEffect(() => {
    //每3秒请求一次，然后存储
    const timer = setInterval(() => {
      const credentials = useCrenditial.getState().crenditial
      network.login(credentials);
    }, 60000)
    //每半个小时，清楚浏览器缓存
    const clear = setTimeout(() => {
      if (timer) {
        useCrenditial.getState().removeCrenditial;
      }
    }, 1800000)

    return () => {
      clearTimeout(clear);
      clearInterval(timer);
    }
  }, [])
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Index />
}
const JudgeCheck = () => {
  const root = network.getRoot();
  if (!root) {
    return <Navigate to="/activities" replace />
  }
  return <Check />
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
        element: <JudgeCheck />,
      },
      {
        path: '/exam/:id',
        element: <CheckHall />
      }
    ],
  },
])
