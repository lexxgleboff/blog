/* eslint-disable consistent-return */
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ThreeDots } from 'react-loader-spinner'
import classes from './RegistrationPage.module.sass'
import { useAppDispatch, useAppSelector } from '../../../hook'
import { fetchRegUser } from '../../../redux/slice/userSlice'

type Profile = {
  name: string
  email: string
  password: string
  repeatPassword: string
  acceptTerms: boolean
}

const RegisrationPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { error, loading, isReg } = useAppSelector((state) => state.user)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<Profile>({
    mode: 'onChange',
  })

  const onSubmit = handleSubmit((data) => {
    const validData = {
      user: {
        username: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
      },
    }
    dispatch(fetchRegUser(validData))
  })

  useEffect(() => {
    if (!isReg) {
      navigate('/sign-up', { replace: true })
    } else {
      reset()
      navigate('/sign-in', { replace: true })
    }
  }, [isReg])

  return (
    <div className={classes.container}>
      <form
        onSubmit={onSubmit}
        className={classes.form}>
        <span className={classes['sign-in']}>Create new account</span>
        <span className={classes.label}>Username</span>
        <input
          type="text"
          placeholder="Usermane"
          className={classes.input}
          {...register('name', {
            required: 'Поле обязательно к заполнению',
            minLength: 3,
            maxLength: 20,
            pattern: {
              value: /^[a-z][a-z0-9]*$/,
              message: 'Username может начинаться только со строчных английских букв и содержать цифры',
            },
          })}
        />
        {errors?.name && (
          <span className={classes.error}>{errors?.name?.message || 'Username должен быть от 3 до 20 символов'}</span>
        )}
        <span className={classes.label}>Email address</span>
        <input
          type="email"
          placeholder="Email address"
          className={classes.input}
          {...register('email', {
            required: 'Поле обязательно к заполнению',
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: 'Введите корректный e-mail',
            },
          })}
        />
        {errors?.email && <span className={classes.error}>{errors?.email?.message || 'Некорректный Email'}</span>}
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
        <span className={classes.label}>Repeat password</span>
        <input
          type="password"
          placeholder="Password"
          className={classes.input}
          {...register('repeatPassword', {
            required: 'Поле обязательно к заполнению',
            minLength: 6,
            maxLength: 40,
            validate: (val: string) => {
              if (watch('password') !== val) {
                return 'Пароль должен совпадать'
              }
            },
          })}
        />
        {errors?.repeatPassword && (
          <span className={classes.error}>
            {errors?.repeatPassword?.message || 'Password должен быть от 6 до 40 символов'}
          </span>
        )}
        <div className={classes['box-checkbox']}>
          <input
            type="checkbox"
            className={classes.checkbox}
            id="acceptTerms"
            {...register('acceptTerms', { required: 'Соглашение с условиями обязательно' })}></input>
          <label htmlFor="acceptTerms">I agree to the processing of my personal information</label>
        </div>
        {errors?.acceptTerms && <span className={classes.error}>{errors?.acceptTerms?.message || ''}</span>}
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
            'Create'
          )}
        </button>
        <span className={classes.text}>
          Already have an account? <Link to={'/sign-in'}>Sign In.</Link>
        </span>
      </form>
    </div>
  )
}

export default RegisrationPage
