import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../../utils/burger-api';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);
