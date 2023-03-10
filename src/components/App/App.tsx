import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import MyLayout from '../Layout/Layout'
import RegisrationPage from '../Pages/Registration/RegisrationPage'
import LoginPage from '../Pages/Login/LoginPage'
import ArticlesPage from '../Pages/Articles/ArticlesPage'
import ArticlePage from '../Pages/Article/ArticlePage'
import ProfilePage from '../Pages/Profile/ProfilePage'
import PrivateRoute from '../../utils/privateRoute'
import CreateArticlePage from '../Pages/CreateArticle/CreateArticlePage'
import EditArticlePage from '../Pages/EditArticle/EditArticlePage'
import { useAppDispatch } from '../../hooks/hook'
import { fetchGetCurrentUser } from '../../redux/slice/userSlice'

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchGetCurrentUser())
  }, [])
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<MyLayout />}>
          <Route
            index
            element={<ArticlesPage />}
          />
          <Route
            path="articles"
            element={<ArticlesPage />}
          />
          <Route
            path="articles/:slug"
            element={<ArticlePage />}
          />
          <Route
            path="sign-in"
            element={<LoginPage />}
          />
          <Route
            path="sign-up"
            element={<RegisrationPage />}
          />
          <Route element={<PrivateRoute />}>
            <Route
              path="profile"
              element={<ProfilePage />}
            />
            <Route
              path="new-article"
              element={<CreateArticlePage />}
            />
            <Route
              path="articles/:slug/edit"
              element={<EditArticlePage />}
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={<h2>Ресурс не найден</h2>}
        />
      </Routes>
    </>
  )
}

export default App
