/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import classes from './Header.module.sass'
import { useAppDispatch } from '../../../hook'
import { togglePage } from '../../../redux/slice/articlesSlice'
import { useAuth } from '../../../hooks/use-auth'
import { logout } from '../../../redux/slice/userSlice'
import defaultAvatar from '../../../assets/defaultAvatar.jpg'

const Header: React.FC = () => {
  const { isAuth, username, image } = useAuth()
  const dispatch = useAppDispatch()
  const { Header } = Layout

  return (
    <Header
      style={{ background: '#fff', height: '80px' }}
      className={classes.header}>
      <Link
        to="/"
        onClick={() => dispatch(togglePage(1))}>
        Realworld Blog
      </Link>
      {!isAuth ? (
        <div>
          <Link
            to="/sign-in"
            className={classes['sign-in']}>
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className={classes['sign-up']}>
            Sign Up
          </Link>
        </div>
      ) : (
        <div className={classes.islogin}>
          <div>
            <Link
              to="/new-article"
              className={classes['create']}>
              Create article
            </Link>
          </div>
          <Link
            to="/profile"
            className={classes.account}>
            <span>{username}</span>
            <img
              className={classes.avatar}
              src={image ?? defaultAvatar}
              alt="avatar"
            />
          </Link>
          <div>
            <Link
              to="/"
              onClick={() => dispatch(logout())}
              className={classes['logout']}>
              Log Out
            </Link>
          </div>
        </div>
      )}
    </Header>
  )
}

export default Header
