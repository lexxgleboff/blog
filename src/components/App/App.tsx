import { Routes, Route } from 'react-router-dom'
// import { useEffect } from 'react'
// import classes from './App.module.sass'
import MyLayout from '../Layout/Layout'
import RegisrationPage from '../Pages/Registration/RegisrationPage'
import LoginPage from '../Pages/Login/LoginPage'
import ArticlesPage from '../Pages/Articles/ArticlesPage'
import ArticlePage from '../Pages/Article/ArticlePage'
// import { useAppDispatch, useAppSelector } from '../../hook'
// import { fetchArticles } from '../../redux/slice/articlesSlice'

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<MyLayout></MyLayout>}>
          <Route
            index
            element={<ArticlesPage></ArticlesPage>}></Route>
          <Route
            path="articles"
            element={<ArticlesPage></ArticlesPage>}></Route>
          <Route
            path="articles/:slug"
            element={<ArticlePage></ArticlePage>}></Route>
          <Route
            path="sign-in"
            element={<LoginPage></LoginPage>}></Route>
          <Route
            path="sign-up"
            element={<RegisrationPage></RegisrationPage>}></Route>
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
