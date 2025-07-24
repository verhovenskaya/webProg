import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: UIState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.isError = true;
      state.errorMessage = action.payload;
    },
    clearError(state) {
      state.isError = false;
      state.errorMessage = null;
    },
  },
});

export const { setLoading, setError, clearError } = uiSlice.actions;
export default uiSlice.reducer;