import { useAppSelector } from '../hook'

export function useAuth() {
  const { email, token, username, bio, image } = useAppSelector((state) => state.user.user)

  return {
    isAuth: !!email,
    email,
    token,
    username,
    bio,
    image,
  }
}
