import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import classes from './Layout.module.sass'

const MyLayout: React.FC = () => {
  return (
    <Layout>
      <Header></Header>
      <div className={classes.container}>
        <Outlet />
      </div>
    </Layout>
  )
}

export default MyLayout
