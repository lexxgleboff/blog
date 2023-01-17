import { HeartOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import classes from './Article.module.sass'
import { IArticle } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface ArticleProps {
  article: IArticle
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  const { slug, title, description, author, createdAt, favoritesCount, tagList } = article
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
            <HeartOutlined
              style={{ cursor: 'pointer', marginRight: '5px', fontSize: '16px', color: 'rgba(0, 0, 0, .75)' }}
            />
            <span className={classes['count-like']}>{favoritesCount}</span>
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
