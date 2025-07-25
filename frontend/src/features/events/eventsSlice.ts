import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEvents } from '../../api/events'; // Используем обновленную функцию
import type { IEvent } from '../../types/event.types';

interface EventsState {
  events: IEvent[];
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

export const fetchEventsData = createAsyncThunk(
  'events/fetchEvents',
  async (userId: number | undefined, thunkAPI) => {
    return await fetchEvents(userId);
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventsData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEventsData.fulfilled, (state, action) => {
        state.events = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEventsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.error.message || 'Ошибка загрузки мероприятий';
      });
  },
});

export default eventsSlice.reducer;