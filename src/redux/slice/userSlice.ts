/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk, AnyAction, PayloadAction } from '@reduxjs/toolkit'

type PostDataCreateUser = {
  user: {
    username: string
    email: string
    password: string
  }
}

type PostDataUpdateUser = {
  user: {
    email?: string
    password?: string
    username?: string
    bio?: string
    image?: string
  }
}

type PostDataLoginUser = {
  user: {
    email: string
    password: string
  }
}

type UserType = {
  email: string
  token: string
  username: string
  bio: string
  image: string
}

type UserState = {
  user: UserType
  error: string
  loading: boolean | null
  isReg: boolean
  update: boolean
}

const initialState: UserState = {
  user: {
    email: '',
    token: '',
    username: '',
    bio: '',
    image: '',
  },
  error: '',
  loading: null,
  isReg: false,
  update: false,
}

export const fetchRegUser = createAsyncThunk<UserState, PostDataCreateUser, { rejectValue: string }>(
  'user/fetchRegUser',
  async (validData, { rejectWithValue }) => {
    const response = await fetch('https://blog.kata.academy/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validData),
    })
    if (response.status === 422) {
      return rejectWithValue('Пользователь с таким username или email существует')
    }
    const data = await response.json()
    if (!localStorage.getItem('token')) localStorage.setItem('token', data.user.token)
    return data
  }
)

export const fetchLoginUser = createAsyncThunk<UserState, PostDataLoginUser, { rejectValue: string }>(
  'user/fetchLoginUser',
  async (validData, { rejectWithValue }) => {
    const response = await fetch('https://blog.kata.academy/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validData),
    })
    if (response.status === 422) {
      return rejectWithValue('Логин или пароль неверные')
    }
    const data = await response.json()
    if (!localStorage.getItem('token')) localStorage.setItem('token', data.user.token)
    return data
  }
)

export const fetchGetCurrentUser = createAsyncThunk<UserState, undefined, { rejectValue: string }>(
  'user/fetchGetCurrentUser',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog.kata.academy/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      return rejectWithValue('')
    }
    const data = await response.json()
    return data
  }
)

export const fetchUpdateUser = createAsyncThunk<UserState, PostDataUpdateUser, { rejectValue: string }>(
  'user/fetchUpdateUser',
  async (validData, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog.kata.academy/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validData),
    })
    if (!response.ok) {
      return rejectWithValue('Для доступа к этой странице нужно залогиниться')
    }
    const data = await response.json()
    localStorage.setItem('token', data.user.token)
    return data
  }
)

function isError(action: AnyAction) {
  return action.type.endsWith('rejected')
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token')
      state.user = {
        email: '',
        token: '',
        username: '',
        bio: '',
        image: '',
      }
    },
    errorNull(state) {
      state.error = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegUser.pending, (state) => {
        state.loading = true
        state.isReg = false
        state.error = ''
      })
      .addCase(fetchRegUser.fulfilled, (state) => {
        state.loading = false
        state.isReg = true
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.loading = false
      })
      .addCase(fetchGetCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.loading = false
        state.update = true
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, errorNull } = userSlice.actions

export default userSlice.reducer
