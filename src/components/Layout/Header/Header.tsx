/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import classes from './Header.module.sass'
import { useAppDispatch } from '../../../hook'
import { togglePage } from '../../../redux/slice/articlesSlice'

type Props = {}

const Header = (props: Props) => {
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
    </Header>
  )
}

export default Header
