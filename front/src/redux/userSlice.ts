import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import MyAxios from '../Interceptors/interceptors';
import { LoginResponse, RegisterResponse, LoginType, RegisterType, UserSlice } from '../types';
import {AxiosError} from "axios";

// 1. Créer les thunks avec un typage approprié

// Créer un thunk pour l'enregistrement
export const registerRedux = createAsyncThunk<RegisterResponse, RegisterType, { rejectValue: string }>(
  'Register user',
  async (body, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/auth/register', JSON.stringify(body));
      return response.data;  // Assurez-vous de retourner les données avec le bon type
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Error during registration';
        return rejectWithValue(errorMessage);
      }
    }
  },
);

// Créer un thunk pour la connexion
export const loginRedux = createAsyncThunk<LoginResponse, LoginType, { rejectValue: string }>(
  'Login user',
  async (body, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/auth/login', JSON.stringify(body));
      return response.data;  // Assurez-vous de retourner les données avec le bon type
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Error during login';
        return rejectWithValue(errorMessage);
      }
    }
  },
);

// Créer un thunk pour vérifier si l'utilisateur est connecté
export const isConnected = createAsyncThunk<boolean, void, { rejectValue: string }>(
  'IsConnected user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.get('/auth/validate_token');
      return response.data.connected;  // Retourne un booléen (true ou false)
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Error checking connection status';
        return rejectWithValue(errorMessage);
      }
    }
  },
);

// Créer un thunk pour actualiser le token
export const refreshToken = createAsyncThunk<LoginResponse, void, { rejectValue: string }>(
  'RefreshToken user',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MyAxios.post('/auth/refresh_token', JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Error refreshing token';
        return rejectWithValue(errorMessage);
      }
    }
  },
);

// 2. Créer un slice avec les reducers et extraReducers

const userSlice = createSlice({
  name: 'user',
  initialState: {
    statusRegister: 'idle',
    statusLogin: 'idle',
    statusCheck: 'idle',
    error: null,
    statusUser: null,
    connected: false,
  } as UserSlice,  // Typage de l'état initial
  reducers: {
    disconnected: (state) => {
      state.connected = false;
      state.error = null;
      state.statusUser = null;
      state.statusLogin = 'idle';
      state.statusRegister = 'idle';
      localStorage.setItem('accessToken', '');
      localStorage.setItem('refreshToken', '');
    },
    resetError: (state) => {
      state.error = null;
      state.statusLogin = 'idle';
      state.statusRegister = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerRedux.pending, (state: UserSlice) => {
        state.statusRegister = 'loading';
      })
      .addCase(registerRedux.fulfilled, (state: UserSlice, action: PayloadAction<RegisterResponse>) => {
        state.statusRegister = 'success';
        state.statusCheck = 'idle';
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.statusUser = action.payload.statusUser;
      })
      .addCase(registerRedux.rejected, (state: UserSlice, action: PayloadAction<string | undefined>) => {
        state.statusRegister = 'failed';
        state.error = action.payload || 'Unknown error';  // Gestion de l'erreur avec `string | undefined`
      })
      .addCase(loginRedux.pending, (state: UserSlice) => {
        state.statusLogin = 'loading';
      })
      .addCase(loginRedux.fulfilled, (state: UserSlice, action: PayloadAction<LoginResponse>) => {
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.statusLogin = 'success';
        state.statusCheck = 'idle';
        state.statusUser = action.payload.statusUser;
      })
      .addCase(loginRedux.rejected, (state: UserSlice, action: PayloadAction<string | undefined>) => {
        state.statusLogin = 'failed';
        state.error = action.payload || 'Unknown error';  // Gestion de l'erreur avec `string | undefined`
      })
      .addCase(isConnected.pending, (state: UserSlice) => {
        state.statusCheck = 'pending';
      })
      .addCase(isConnected.fulfilled, (state: UserSlice, action: PayloadAction<boolean>) => {
        state.statusCheck = 'success';
        state.connected = action.payload;
      })
      .addCase(isConnected.rejected, (state: UserSlice, action: PayloadAction<string | undefined>) => {
        state.statusCheck = 'failed';
        state.connected = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(refreshToken.fulfilled, (state: UserSlice, action: PayloadAction<LoginResponse>) => {
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state: UserSlice, action: PayloadAction<string | undefined>) => {
        console.log('refreshToken rejected', action);
        state.error = action.payload || 'Unknown error';
      });
  },
});

// 3. Exporter les actions et le reducer
export const { disconnected, resetError } = userSlice.actions;
export default userSlice.reducer;
