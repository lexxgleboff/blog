import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classes from './LoginPage.module.sass'

type Profile = {
  email: string
  password: string
}

const LoginPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Profile>({
    mode: 'onBlur',
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
        <button
          className={classes.btn}
          type="submit">
          Login
        </button>
        <span className={classes.text}>
          Don’t have an account? <Link to={'/sign-up'}>Sign Up.</Link>
        </span>
      </form>
    </div>
  )
}

export default LoginPage
