import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowedRoles}) => {
    //will implement role based access later
  return <Outlet />
}

export default PrivateRoutes