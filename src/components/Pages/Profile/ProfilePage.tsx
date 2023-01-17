/* eslint-disable consistent-return */
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'
import classes from './ProfilePage.module.sass'
import { useAuth } from '../../../hooks/use-auth'
import { useAppSelector, useAppDispatch } from '../../../hook'
import { fetchUpdateUser } from '../../../redux/slice/userSlice'

type Profile = {
  email: string
  password: string
  username: string
  bio: string
  image: string
  avatar: string
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const { loading, update } = useAppSelector((state) => state.user)
  const { email, username, image } = useAuth()
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Profile>({
    mode: 'onChange',
    defaultValues: { username, email, avatar: image },
  })

  const onSubmit = handleSubmit((data) => {
    const validData = {
      user: {
        email: data.email,
        password: data.password,
        username: data.username,
        image: data.avatar,
      },
    }
    dispatch(fetchUpdateUser(validData))
  })

  useEffect(() => {
    if (update) {
      const timeout = setTimeout(() => {
        navigate('/sign-up', { replace: true })
      }, 2000)
      return clearTimeout(timeout)
    }
  }, [update])

  return (
    <div className={classes.container}>
      <form
        onSubmit={onSubmit}
        className={classes.form}>
        <span className={classes['profile']}>Edit Profile</span>
        <span className={classes.label}>Username</span>
        <input
          type="text"
          placeholder="Usermane"
          className={classes.input}
          {...register('username', {
            required: 'Поле обязательно к заполнению',
            minLength: 3,
            maxLength: 20,
            pattern: {
              value: /^[a-z][a-z0-9]*$/,
              message: 'Username может начинаться только со строчных английских букв и содержать цифры',
            },
          })}
        />
        {errors?.username && (
          <span className={classes.error}>
            {errors?.username?.message || 'Username должен быть от 3 до 20 символов'}
          </span>
        )}
        <span className={classes.label}>Email address</span>
        <input
          disabled
          type="email"
          placeholder="Email address"
          className={classes.input}
          {...register('email', {
            required: 'Поле обязательно к заполнению',
            minLength: 3,
            maxLength: 20,
          })}
        />
        {errors?.email && (
          <span className={classes.error}>{errors?.email?.message || 'Username должен быть от 3 до 20 символов'}</span>
        )}
        <span className={classes.label}>New password</span>
        <input
          type="password"
          placeholder="New password"
          className={classes.input}
          {...register('password', {
            required: 'Поле обязательно к заполнению',
            minLength: 6,
            maxLength: 40,
          })}
        />
        {errors?.password && (
          <span className={classes.error}>
            {errors?.password?.message || 'Password должен быть от 6 до 40 символов'}
          </span>
        )}
        <span className={classes.label}>Avatar image(url)</span>
        <input
          type="text"
          placeholder="Avatar image"
          className={classes.input}
          {...register('avatar', {
            pattern: {
              value:
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
              message: 'Некорректный URL',
            },
          })}
        />
        {errors?.avatar && <span className={classes.error}>{errors?.avatar?.message || ''}</span>}
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
            'Save'
          )}
        </button>
        <span className={classes.success}>{update ? 'Данные обновлены' : ''}</span>
      </form>
    </div>
  )
}

export default ProfilePage
