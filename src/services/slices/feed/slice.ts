import { createSlice, createSelector } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';
import { getFeedsThunk, getOrderByNumberThunk } from './actions';

export interface FeedState {
  orders: TOrder[];
  isFeedsLoading: boolean;
  order: TOrder | null;
  isOrderLoading: boolean;
  total: number;
  totalToday: number;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  isFeedsLoading: false,
  order: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.rejected, (state, { error }) => {
        state.isFeedsLoading = false;
        state.error = error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getFeedsThunk.fulfilled, (state, { payload }) => {
        state.isFeedsLoading = false;
        state.orders = payload.orders;
        state.total = payload.total;
        state.totalToday = payload.totalToday;
        state.error = null;
      })

      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, { error }) => {
        state.isOrderLoading = false;
        state.error = error.message || 'Ошибка загрузки заказа';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, { payload }) => {
        state.order = payload.orders[0] || null;
        state.isOrderLoading = false;
        state.error = null;
      });
  }
});

export const ordersSelector = (state: { feed: FeedState }) => state.feed.orders;
export const isFeedsLoadingSelector = (state: { feed: FeedState }) =>
  state.feed.isFeedsLoading;
export const orderSelector = (state: { feed: FeedState }) => state.feed.order;
export const isOrderLoadingSelector = (state: { feed: FeedState }) =>
  state.feed.isOrderLoading;
export const totalSelector = (state: { feed: FeedState }) => state.feed.total;
export const totalTodaySelector = (state: { feed: FeedState }) =>
  state.feed.totalToday;

export default feedSlice.reducer;
