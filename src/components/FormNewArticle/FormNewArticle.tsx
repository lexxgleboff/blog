import { useEffect } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import classes from './FormNewArticle.module.sass'
import { useAppDispatch, useAppSelector } from '../../hooks/hook'
import { fetchCreateArticle, fetchUpdateArticle, togglePage } from '../../redux/slice/articlesSlice'

interface IFormNewArticle {
  title: string
  titleArticle: string | undefined
  description: string | undefined
  body: string | undefined
  tagList: { name: string }[] | undefined
  slug: string | undefined
}

type Profile = {
  title: string
  description: string
  body: string
  tagList: { name: string }[]
}

const FormNewArticle: React.FC<IFormNewArticle> = ({ title, titleArticle, description, body, tagList, slug }) => {
  const navigate = useNavigate()
  const { loading, create, update } = useAppSelector((state) => state.articles)
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues,
  } = useForm<Profile>({
    mode: 'onChange',
    defaultValues: {
      title: titleArticle || '',
      description: description || '',
      body: body || '',
      tagList: tagList || [{ name: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    name: 'tagList',
    control,
  })

  const onSubmit = handleSubmit((data) => {
    const validData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tagList.map((tag) => tag.name),
      },
    }
    const slugData = {
      validData,
      slug,
    }
    if (slug) {
      dispatch(fetchUpdateArticle(slugData))
      dispatch(togglePage(1))
    } else {
      dispatch(fetchCreateArticle(validData))
      dispatch(togglePage(1))
    }
  })

  useEffect(() => {
    if (create) {
      navigate('/', { replace: true })
    } else if (update) {
      navigate('/', { replace: true })
    }
  }, [create, update])

  return (
    <div className={classes.form}>
      <form onSubmit={onSubmit}>
        <h2 className={classes.title}>{title}</h2>
        <span className={classes.label}>Title</span>
        <input
          type="text"
          placeholder="Title"
          {...register('title', {
            required: 'Поле обязательно к заполнению',
          })}
        />
        {errors?.title && <span className={classes.error}>{errors?.title?.message || ''}</span>}
        <span className={classes.label}>Short description</span>
        <input
          type="text"
          placeholder="Description"
          {...register('description', {
            required: 'Поле обязательно к заполнению',
          })}
        />
        {errors?.description && <span className={classes.error}>{errors?.description?.message || ''}</span>}
        <span className={classes.label}>Text</span>
        <textarea
          placeholder="Text"
          className={classes.area}
          {...register('body', {
            required: 'Поле обязательно к заполнению',
          })}
        />
        {errors?.body && <span className={classes.error}>{errors?.body?.message || ''}</span>}
        <span className={classes.label}>Tags</span>
        <div className={classes['container-tag']}>
          {fields.map((field, index) => (
            <div
              style={{ display: 'inherit', height: '35px' }}
              key={field.id}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '320px' }}>
                <input
                  type="text"
                  placeholder="Tag"
                  className={classes.tag}
                  {...register(`tagList.${index}.name`, {
                    required: 'Тег не должен быть пустой, заполните или удалите',
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: 'Вы можете использовать только английские буквы и цифры без пробелов и других символов',
                    },
                    validate: (tagInputValue) =>
                      !getValues()
                        .tagList.map((tagObject: { name: string }) => tagObject.name)
                        .filter((_, currentChangingTagIndex: number) => index !== currentChangingTagIndex)
                        .includes(tagInputValue) || 'Теги должны быть уникальные!',
                  })}
                />
                {errors?.tagList?.[index] && (
                  <span className={classes.error}>{errors?.tagList?.[index]?.name?.message?.toString()}</span>
                )}
              </div>
              <Button
                type="primary"
                danger
                ghost
                className={classes.delete}
                style={{ marginRight: '8px' }}
                onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
          ))}

          <Button
            type="primary"
            ghost
            className={classes.add}
            onClick={() => {
              append({
                name: '',
              })
            }}>
            Add tag
          </Button>
        </div>

        <button
          className={classes.btn}
          type="submit">
          {loading ? (
            <ThreeDots
              height="20"
              width="20"
              radius="9"
              color="#fff"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ justifyContent: 'center' }}
              visible={true}
            />
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  )
}

export default FormNewArticle
