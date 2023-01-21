import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { RotatingLines } from 'react-loader-spinner'
import { format } from 'date-fns'
import { Button, Popconfirm } from 'antd'
import classes from './ArticlePage.module.sass'
import { useAppDispatch, useAppSelector } from '../../../hook'
import { fetchArticle, fetchDeleteArticle, fetchLikeToggle, togglePage } from '../../../redux/slice/articlesSlice'
import { useAuth } from '../../../hooks/use-auth'

const ArticlePage: React.FC = () => {
  const { isAuth, username } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()
  const { article, loading, deleted } = useAppSelector((state) => state.articles)
  const { title, description, author, createdAt, favoritesCount, body, favorited } = article
  const [like, setLike] = useState(favorited)
  const [count, setCount] = useState(favoritesCount)
  useEffect(() => {
    if (slug) {
      dispatch(fetchArticle(slug))
    }
    if (favorited || !favorited) {
      setLike(favorited)
    }
    setCount(favoritesCount)
  }, [slug, favorited, favoritesCount])

  useEffect(() => {
    if (deleted) {
      navigate('/', { replace: true })
    }
  }, [deleted])

  const confirm = () => {
    dispatch(fetchDeleteArticle(slug))
    dispatch(togglePage(1))
  }

  const cancel = () => {}

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
                  <button
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
                  <span className={classes.tag}>Tag1</span>
                </div>
                <p className={classes.description}>{description}</p>
              </div>
              <div className={classes.author}>
                <div style={{ display: 'flex', marginBottom: '15px' }}>
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
                {isAuth && username === author.username && (
                  <div>
                    <Popconfirm
                      placement="right"
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      onConfirm={confirm}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No">
                      <Button
                        type="primary"
                        danger
                        ghost
                        className={classes.delete}
                        style={{ marginRight: '8px' }}>
                        Delete
                      </Button>
                    </Popconfirm>

                    <Link
                      to={`/articles/${slug}/edit`}
                      className={classes.edit}>
                      Edit
                    </Link>
                  </div>
                )}
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
