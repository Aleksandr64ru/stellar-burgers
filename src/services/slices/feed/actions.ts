import { createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '../../../utils/burger-api';

/**
 */
export const getFeedsThunk = createAsyncThunk('feeds/getFeeds', async () =>
  getFeedsApi()
);

/**
 * @param number Номер интересуемого заказа
 */
export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrder',
  async (number: number) => getOrderByNumberApi(number)
);
