import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

function privateRoute() {
  const { isAuth } = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="sign-in" />
}

export default privateRoute
