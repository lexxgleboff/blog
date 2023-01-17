import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import classes from './LoginPage.module.sass'
import { fetchLoginUser } from '../../../redux/slice/userSlice'
import { useAppDispatch, useAppSelector } from '../../../hook'
import { useAuth } from '../../../hooks/use-auth'

type Profile = {
  email: string
  password: string
}

const LoginPage = () => {
  const { error, loading } = useAppSelector((state) => state.user)
  const { isAuth } = useAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Profile>({
    mode: 'onChange',
  })

  const onSubmit = handleSubmit((data) => {
    const validData = {
      user: {
        email: data.email.toLowerCase(),
        password: data.password,
      },
    }
    dispatch(fetchLoginUser(validData))
  })

  useEffect(() => {
    if (isAuth) {
      reset()
      navigate('/', { replace: true })
    }
  }, [isAuth])

  return (
    <div className={classes.container}>
      <form
        onSubmit={onSubmit}
        className={classes.form}>
        <span className={classes['sign-in']}>Sign In</span>
        <span className={classes.label}>Email address</span>
        <input
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
        <span className={classes.label}>Password</span>
        <input
          type="password"
          placeholder="Password"
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
        <span className={classes.error}>{error ?? ''}</span>
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
            'Login'
          )}
        </button>
        <span className={classes.text}>
          Don’t have an account? <Link to={'/sign-up'}>Sign Up.</Link>
        </span>
      </form>
    </div>
  )
}

export default LoginPage
