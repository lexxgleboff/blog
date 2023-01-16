import { useEffect } from 'react'
import { Pagination } from 'antd'
import { RotatingLines } from 'react-loader-spinner'
import classes from './ArticlesPage.module.sass'
import { useAppDispatch, useAppSelector } from '../../../hook'
import Article from '../../Article/Article'
import { fetchArticles, nextPage, togglePage } from '../../../redux/slice/articlesSlice'

const ArticlesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { articles, loading, articlesCount, currentPage } = useAppSelector((state) => state.articles)
  const onChangePage = (pageNumber: number) => {
    dispatch(nextPage(pageNumber))
    dispatch(togglePage(pageNumber))
  }
  useEffect(() => {
    dispatch(fetchArticles())
  }, [])
  const articlesList = articles.map((article) => {
    return (
      <Article
        key={article.slug}
        article={article}></Article>
    )
  })
  return (
    <>
      {loading ? (
        <div className={classes.loading}>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      ) : (
        <div className={classes.articles}>
          <div className={classes.article}>{articlesList}</div>
          <div className={classes.pagination}>
            <Pagination
              current={currentPage}
              onChange={(num) => onChangePage(num)}
              total={articlesCount}
              hideOnSinglePage={true}
              pageSize={5}
              showSizeChanger={false}></Pagination>
          </div>
        </div>
      )}
    </>
  )
}

export default ArticlesPage
