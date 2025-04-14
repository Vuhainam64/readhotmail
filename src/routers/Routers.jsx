import React from 'react'
import { useRoutes } from 'react-router-dom'

import { CheckLiveTextnow, MergeHotmail, ReadHotmail, ReadPhoneShopee } from '../pages'

const Routers = () => {
  const routing = useRoutes([
    {
      path: '/readHotmail',
      element: <ReadHotmail />,
    },
    {
      path: '/mergeHotmail',
      element: <MergeHotmail />,
    },
    {
      path: '/readPhoneShopee',
      element: <ReadPhoneShopee />,
    },
    {
      path: '/checkLiveTextnow',
      element: <CheckLiveTextnow />,
    },
  ])
  return routing
}

export default Routers
