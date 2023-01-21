/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk, AnyAction, PayloadAction } from '@reduxjs/toolkit'

type CreateArticle = {
  article: {
    title: string
    description: string
    body: string
    tagList: string[]
  }
}

type UpdateArticle = {
  slug: string | undefined
  validData: {
    article: {
      title: string
      description: string
      body: string
      tagList: string[]
    }
  }
}

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
  create: boolean
  deleted: boolean
  update: boolean
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
  create: false,
  deleted: false,
  update: false,
}

export const fetchArticles = createAsyncThunk<ArticlesState, undefined, { rejectValue: string }>(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog.kata.academy/api/articles?limit=5', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
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
    const token = localStorage.getItem('token')
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      return rejectWithValue('Server Error')
    }
    const data = await response.json()
    return data
  }
)

export const fetchCreateArticle = createAsyncThunk<ArticlesState, CreateArticle, { rejectValue: string }>(
  'articles/fetchCreateArticle',
  async (validData, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const response = await fetch('https://blog.kata.academy/api/articles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(validData),
    })
    if (!response.ok) {
      return rejectWithValue('Статья не создана')
    }
    const data = await response.json()
    return data
  }
)

export const fetchLikeToggle = createAsyncThunk<
  ArticlesState,
  [favorited: boolean, slug: string | undefined],
  { rejectValue: string }
>('articles/fetchLikeToggle', async (slug, { rejectWithValue }) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`https://blog.kata.academy/api/articles/${slug[1]}/favorite`, {
    method: !slug[0] ? 'POST' : 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    return rejectWithValue('Лайк не поставлен')
  }
  const data = await response.json()
  return data
})

export const fetchDeleteArticle = createAsyncThunk<void, string | undefined, { rejectValue: string }>(
  'articles/fetchDeleteArticle',
  async (slug, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      return rejectWithValue('Статья не удалена')
    }
  }
)

export const fetchUpdateArticle = createAsyncThunk<void, UpdateArticle, { rejectValue: string }>(
  'articles/fetchUpdateArticle',
  async (slugData, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    const { slug } = slugData
    const response = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slugData.validData),
    })
    if (!response.ok) {
      return rejectWithValue('Статья не обновлена')
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
        state.create = false
        state.deleted = false
        state.update = false
        state.articles = action.payload.articles
        state.articlesCount = action.payload.articlesCount
      })
      .addCase(fetchCreateArticle.pending, (state) => {
        state.loading = true
        state.error = null
        state.create = false
      })
      .addCase(fetchCreateArticle.fulfilled, (state) => {
        state.loading = false
        state.create = true
      })
      .addCase(fetchLikeToggle.pending, (state) => {
        state.error = null
      })
      .addCase(fetchLikeToggle.fulfilled, (state, action) => {
        // state.article = action.payload.article
        state.articles.map((article) => {
          if (article.slug === action.payload.article.slug) article = action.payload.article
          return article
        })
      })
      .addCase(fetchUpdateArticle.pending, (state) => {
        state.loading = true
        state.error = null
        state.update = false
      })
      .addCase(fetchUpdateArticle.fulfilled, (state) => {
        state.loading = false
        state.update = true
      })
      .addCase(fetchDeleteArticle.pending, (state) => {
        state.loading = true
        state.error = null
        state.deleted = false
      })
      .addCase(fetchDeleteArticle.fulfilled, (state) => {
        state.loading = false
        state.deleted = true
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
