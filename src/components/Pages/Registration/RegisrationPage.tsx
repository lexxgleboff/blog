/* eslint-disable consistent-return */
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
// import { Checkbox } from 'antd'
import classes from './RegistrationPage.module.sass'

type Profile = {
  name: string
  email: string
  password: string
  repeatPassword: string
  acceptTerms: boolean
}

const RegisrationPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<Profile>({
    mode: 'onChange',
  })

  const onSubmit = handleSubmit((data: {}) => {
    console.log(data)
    reset()
  })

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
            {errors?.password?.message || 'Password должен быть от 3 до 20 символов'}
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
            {errors?.repeatPassword?.message || 'Password должен быть от 3 до 20 символов'}
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
        <button
          className={classes.btn}
          type="submit">
          Create
        </button>
        <span className={classes.text}>
          Already have an account? <Link to={'/sign-in'}>Sign In.</Link>
        </span>
      </form>
    </div>
  )
}

export default RegisrationPage
