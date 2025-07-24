import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  // другие поля события
}

interface EventsState {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: EventsState = {
  events: [],
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, thunkAPI) => {
    const response = await axios.get('/api/events');
    return response.data;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || 'Ошибка загрузки событий';
      });
  },
});

export default eventsSlice.reducer;