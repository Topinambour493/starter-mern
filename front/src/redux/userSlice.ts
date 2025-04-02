import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import MyAxios from "../Interceptors/interceptors";
import axios from "axios";
import {AuthResponse, LoginType, RegisterType, UserSlice} from "../types";
import {resolveAny} from "node:dns";


// Etape 2: Créer un slice

export const registerRedux: any = createAsyncThunk('Register user', async (body: RegisterType, {rejectWithValue}) => {
  try {
    return await MyAxios.post("/auth/register", JSON.stringify(body))
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const loginRedux: any = createAsyncThunk('Login user', async (body: LoginType, {rejectWithValue}) => {
  try {
    return await MyAxios.post("/auth/login", JSON.stringify(body))
  } catch (error) {
    return rejectWithValue(error)
  }
});

export const isConnected = createAsyncThunk('IsConnected user', async (_, {rejectWithValue}) => {
  try {
    return await MyAxios.get("/auth/validate_token");
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const refreshToken = createAsyncThunk('RefreshToken user', async (_, {rejectWithValue}) => {
  try {
    return await MyAxios.post("/auth/refresh_token", JSON.stringify({"refreshToken": localStorage.getItem("refreshToken")}))
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const userSlice = createSlice({
  name: 'user', // Nom du slice
  initialState: { // les états initiaux
    // Variables que je vais sauvegarder
    statusRegister: 'idle',
    statusLogin: "idle",
    statusCheck: "idle",
    error: null,
    statusUser: null,
    connected: false,
  } as UserSlice,
  reducers: {
    disconnected: (state) => {
      state.connected = false;
      state.error = null;
      state.statusUser = null;
      state.statusLogin = "idle";
      state.statusRegister='idle'
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
    },
    resetError: (state) => {
      state.error = null;
      state.statusLogin = "idle";
      state.statusRegister='idle'
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerRedux.pending, (state:UserSlice) => {
        state.statusRegister = 'loading';
      })
      .addCase(registerRedux.fulfilled, (state: UserSlice, action:any) => {
        state.statusRegister = 'success';
        state.statusCheck = "idle";
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        state.statusUser = action.payload.statusUser;
      })
      .addCase(registerRedux.rejected, (state: UserSlice, action: any) => {
        state.statusRegister = 'failed';
        state.error = action.payload.error
      })
      .addCase(loginRedux.pending, (state: UserSlice) => {
        state.statusLogin = 'loading';
      })
      .addCase(loginRedux.fulfilled, (state: UserSlice, action: any) => {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        state.statusLogin = 'success';
        state.statusCheck = "idle";
        state.statusUser = action.payload.statusUser;
      })
      .addCase(loginRedux.rejected, (state: UserSlice, action: any) => {
        state.statusLogin = 'failed';
        state.error = action.payload.error
      })
      .addCase(isConnected.pending, (state: UserSlice) => {
        state.statusCheck = 'pending';
      })
      .addCase(isConnected.fulfilled, (state: UserSlice, action) => {
        state.statusCheck = 'success';
        state.connected = true;
      })
      .addCase(isConnected.rejected, (state: UserSlice, action) => {
        state.statusCheck = 'failed';
        state.connected = false;
      })
      .addCase(refreshToken.fulfilled, (state: UserSlice, action: any) => {
        localStorage.setItem("accessToken", action.payload.accessToken)
      })
      .addCase(refreshToken.rejected, (state: UserSlice, action: any) => {
        console.log("refreshToken rejected",action)
        state.error = action.payload.error
      });
  },
});

export const {disconnected, resetError} = userSlice.actions;

export default userSlice.reducer;
