import classes from './CreateArticlePage.module.sass'
import FormNewArticle from '../../FormNewArticle/FormNewArticle'

const CreateArticle: React.FC = () => {
  return (
    <div className={classes.container}>
      <FormNewArticle
        title={'Create new article'}
        titleArticle={undefined}
        description={undefined}
        body={undefined}
        tagList={undefined}
        slug={undefined}></FormNewArticle>
    </div>
  )
}

export default CreateArticle
