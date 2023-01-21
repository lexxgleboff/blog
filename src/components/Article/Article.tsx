/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import classes from './Article.module.sass'
import { IArticle } from '../../types'
import { useAppDispatch } from '../../hook'
import { fetchLikeToggle } from '../../redux/slice/articlesSlice'
import { useAuth } from '../../hooks/use-auth'

interface ArticleProps {
  article: IArticle
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  const { isAuth } = useAuth()
  const dispatch = useAppDispatch()
  const { slug, title, description, author, createdAt, tagList, favorited, favoritesCount } = article
  const [like, setLike] = useState(favorited)
  const [count, setCount] = useState(favoritesCount)

  return (
    <>
      <div className={classes.article}>
        <div className={classes.info}>
          <div className={classes.titleblock}>
            <Link
              to={`/articles/${slug}`}
              className={classes.title}>
              {title}
            </Link>
            <button
              disabled={!isAuth}
              className={classes.like}
              onClick={() => {
                setLike(!like)
                setCount(like ? count - 1 : count + 1)
                dispatch(fetchLikeToggle([like, slug]))
              }}>
              {like && isAuth ? (
                <HeartFilled style={{ cursor: 'pointer', marginRight: '5px', fontSize: '16px', color: 'red' }} />
              ) : (
                <HeartOutlined
                  style={{ cursor: 'pointer', marginRight: '5px', fontSize: '16px', color: 'rgba(0, 0, 0, .75)' }}
                />
              )}
            </button>
            <span className={classes['count-like']}>{count}</span>
          </div>
          <div>
            {tagList.map((tag) => {
              return (
                <span
                  key={uuidv4()}
                  className={classes.tag}>
                  {tag}
                </span>
              )
            })}
          </div>
          <p className={classes.description}>{description}</p>
        </div>
        <div className={classes.author}>
          <div>
            <span className={classes.name}>{author.username}</span>
            <span className={classes.date}>{format(new Date(createdAt), 'PPP')}</span>
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
    </>
  )
}

export default Article
