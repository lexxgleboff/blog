/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk, AnyAction, PayloadAction } from '@reduxjs/toolkit'
// import { IArticle } from '../../types'

type IArticle = {
  slug: string
  title: string
  description: string
  body: string
  createdAt: string
  updatedAt: string
  tagList: string[]
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    image: string
    following: boolean
  }
}

type ArticlesState = {
  articles: IArticle[]
  article: IArticle
  articlesCount: number
  loading: boolean | null
  error: string | null
  currentPage: number
}

const initialState: ArticlesState = {
  articles: [],
  article: {
    slug: '',
    title: '',
    description: '',
    body: '',
    createdAt: '',
    updatedAt: '',
    tagList: [],
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      image: '',
      following: false,
    },
  },
  articlesCount: 0,
  loading: null,
  error: null,
  currentPage: 1,
}

export const fetchArticles = createAsyncThunk<ArticlesState, undefined, { rejectValue: string }>(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    const response = await fetch('https://blog.kata.academy/api/articles?limit=5')
    if (!response.ok) {
      return rejectWithValue('Server Error')
    }
    const data = await response.json()
    return data
  }
)

export const fetchArticle = createAsyncThunk<ArticlesState, string, { rejectValue: string }>(
  'articles/fetchArticle',
  async (slug, { rejectWithValue }) => {
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`)
    if (!response.ok) {
      return rejectWithValue('Server Error')
    }
    const data = await response.json()
    return data
  }
)

export const nextPage = createAsyncThunk<ArticlesState, number, { rejectValue: string }>(
  'articles/nextPage',
  async (pageNumber, { rejectWithValue }) => {
    const response = await fetch(`https://blog.kata.academy/api/articles?limit=5&offset=${pageNumber * 5 - 5}`)
    if (!response.ok) {
      return rejectWithValue('Server Error')
    }
    const data = await response.json()
    return data
  }
)

function isError(action: AnyAction) {
  return action.type.endsWith('rejected')
}

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    togglePage(state, action) {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload.article
      })
      .addCase(nextPage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(nextPage.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload
        state.loading = false
      })
  },
})
export const { togglePage } = articlesSlice.actions

export default articlesSlice.reducer
