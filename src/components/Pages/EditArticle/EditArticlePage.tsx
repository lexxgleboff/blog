import { useParams } from 'react-router-dom'
import classes from './EditArticlePage.module.sass'
import FormNewArticle from '../../FormNewArticle/FormNewArticle'
import { useAppSelector } from '../../../hooks/hook'

const EditArticlePage: React.FC = () => {
  const { slug } = useParams()
  const { article } = useAppSelector((state) => state.articles)
  return (
    <div className={classes.container}>
      <FormNewArticle
        title={'Edit article'}
        titleArticle={article.title}
        description={article.description}
        body={article.body}
        tagList={article.tagList.map((tag: string) => ({ name: tag }))}
        slug={slug}></FormNewArticle>
    </div>
  )
}

export default EditArticlePage
