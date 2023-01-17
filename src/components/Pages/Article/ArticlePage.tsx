import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { HeartOutlined } from '@ant-design/icons'
import { RotatingLines } from 'react-loader-spinner'
import { format } from 'date-fns'
import classes from './ArticlePage.module.sass'
import { useAppDispatch, useAppSelector } from '../../../hook'
import { fetchArticle } from '../../../redux/slice/articlesSlice'

const ArticlePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { slug } = useParams()
  const { article, loading } = useAppSelector((state) => state.articles)
  const { title, description, author, createdAt, favoritesCount, body } = article
  console.log(article)
  useEffect(() => {
    if (slug) {
      dispatch(fetchArticle(slug))
    }
  }, [slug])
  return (
    <div className={classes.container}>
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
        <>
          <div className={classes.box}>
            <div className={classes.article}>
              <div className={classes.info}>
                <div className={classes.titleblock}>
                  <span className={classes.title}>{title}</span>
                  <HeartOutlined
                    style={{ cursor: 'pointer', marginRight: '5px', fontSize: '16px', color: 'rgba(0, 0, 0, .75)' }}
                  />
                  <span className={classes['count-like']}>{favoritesCount}</span>
                </div>
                <div>
                  <span className={classes.tag}>Tag1</span>
                </div>
                <p className={classes.description}>{description}</p>
              </div>
              <div className={classes.author}>
                <div>
                  <span className={classes.name}>{author.username}</span>
                  <span className={classes.date}>{createdAt && format(new Date(createdAt), 'PPP')}</span>
                </div>
                <div className={classes.avatar}>
                  <img
                    style={{ height: '46px', width: '46px' }}
                    src={author.image}
                    alt="avatar"
                  />
                </div>
              </div>
            </div>
            <div>
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ArticlePage
