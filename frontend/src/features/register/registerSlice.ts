import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegisterState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isSuccess: boolean;
}

const initialState: RegisterState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  isSuccess: false,
};

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    const response = await axios.post('/api/register', userData);
    return response.data;
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || 'Ошибка регистрации';
      });
  },
});

export default registerSlice.reducer;